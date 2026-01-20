/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import bcrypt from 'bcryptjs';
import { JwtPayload, SignOptions } from 'jsonwebtoken';
import { DataSource } from 'typeorm';

import { Currency } from '../shared/enums/currency.enum';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.dataSource.transaction((manager) =>
      this.usersService.createWithAccounts(
        manager,
        {
          email: dto.email,
          name: dto.name,
          surname: dto.surname,
          password: passwordHash,
        },
        [
          { currency: Currency.EUR, balance: '500' },
          { currency: Currency.USD, balance: '1000' },
        ],
      ),
    );

    const tokens = await this.createTokens(user.id, user.email);
    await this.saveRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user?.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.createTokens(user.id, user.email);
    await this.saveRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshTokens(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>(
          'JWT_REFRESH_SECRET',
          'refresh_secret',
        ),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findByEmailWithPassword(payload.email);
    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.createTokens(user.id, user.email);
    await this.saveRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  private async createTokens(userId: string, email: string) {
    const payload: JwtPayload = { sub: userId, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(
        'JWT_ACCESS_SECRET',
        'access_secret',
      ),
      expiresIn: this.getAccessExpiresIn(),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(
        'JWT_REFRESH_SECRET',
        'refresh_secret',
      ),
      expiresIn: this.getRefreshExpiresIn(),
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.setRefreshTokenHash(userId, hash);
  }

  private getAccessExpiresIn(): SignOptions['expiresIn'] {
    return this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m',
    ) as SignOptions['expiresIn'];
  }

  private getRefreshExpiresIn(): SignOptions['expiresIn'] {
    return this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    ) as SignOptions['expiresIn'];
  }
}
