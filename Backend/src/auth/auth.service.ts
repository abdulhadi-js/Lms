import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private generateTokens(payload: {
    sub: string;
    email: string;
    role: string;
  }) {
    // Pass expiresIn as seconds to satisfy JwtSignOptions type (number)
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET')!,
      expiresIn: 900, // 15 minutes in seconds
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
      expiresIn: 604800, // 7 days in seconds
    });

    return { accessToken, refreshToken };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException(
        'Invalid credentials or inactive account',
      );
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = { sub: user.id, email: user.email, role: user.role };
    const { accessToken, refreshToken } = this.generateTokens(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async refresh(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid user status');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.generateTokens(payload);
  }

  async logout(_userId: string) {
    // In production: add token to Redis blacklist with TTL = remaining token expiry
    return { success: true, message: 'Logged out successfully' };
  }
}
