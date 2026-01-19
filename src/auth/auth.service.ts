import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';

import { Account } from '../accounts/accounts.entity';
import { Currency } from '../shared/enums/currency.enum';
import { User } from '../users/user.entity';
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
    const user = await this.dataSource.transaction(async (manager) => {
      const usersRepo = manager.getRepository(User);
      const accountsRepo = manager.getRepository(Account);
      const createdUser = usersRepo.create({
        email: dto.email,
        name: dto.name,
        surname: dto.surname,
        password: passwordHash,
      });
      const savedUser = await usersRepo.save(createdUser);

      const accounts = accountsRepo.create([
        { userId: savedUser.id, currency: Currency.EUR, balance: '500' },
        { userId: savedUser.id, currency: Currency.USD, balance: '1000' },
      ]);
      await accountsRepo.save(accounts);

      return savedUser;
    });

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
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'refresh_secret'),
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
      secret: this.configService.get<string>('JWT_ACCESS_SECRET', 'access_secret'),
      expiresIn: this.getAccessExpiresIn(),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'refresh_secret'),
      expiresIn: this.getRefreshExpiresIn(),
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.usersService.setRefreshTokenHash(userId, hash);
  }

  private getAccessExpiresIn(): SignOptions['expiresIn'] {
    return this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m') as SignOptions['expiresIn'];
  }

  private getRefreshExpiresIn(): SignOptions['expiresIn'] {
    return this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d') as SignOptions['expiresIn'];
  }
}
