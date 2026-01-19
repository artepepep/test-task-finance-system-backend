import { Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login() {
    return { message: 'Hi from Login' }
  }

  @Get('me')
  async me() {
    return { message: 'Hi from Me' }
  }
}