import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async generateOTP(phone: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

    const user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = otp;
    await this.userRepository.save(user);
    return otp;
  }

  async verifyOTP(phone: string, otp: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { phone } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.password === otp;
  }

  async login(data: { phone: string }): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { phone: data.phone },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const otp = await this.generateOTP(data.phone);
    // OTP sending logic
    console.log(`Sending OTP ${otp} to ${data.phone}`);

    return otp;
  }

  async createToken(user: User): Promise<string> {
    const payload = { username: user.phone, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async validateUser(phone: string): Promise<User> {
    return await this.userRepository.findOne({ where: { phone } });
  }
}
