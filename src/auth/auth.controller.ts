import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userData: Partial<User>): Promise<User> {
    return this.authService.register(userData);
  }

  @Post('login')
  async login(@Body() data: { phone: string }): Promise<{ otp: string }> {
    const otp = await this.authService.login(data);
    return { otp };
  }

  @Post('verify-otp')
  async verifyOTP(
    @Body() body: { phone: string; otp: string },
  ): Promise<{ token: string; is_verified: boolean }> {
    const { phone, otp } = body;

    if (!(await this.authService.verifyOTP(phone, otp))) {
      throw new UnauthorizedException('Invalid OTP');
    }

    const user = await this.authService.validateUser(phone);
    const token = await this.authService.createToken(user);

    return { token, is_verified: true };
  }
}
