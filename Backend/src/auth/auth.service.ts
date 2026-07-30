import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  private generateTokens(payload: { sub: string; email: string; isSuperAdmin: boolean; campusId: string | null; permissions: string[] }) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') || 'default_jwt_secret_for_testing',
      expiresIn: 900, // 15 minutes in seconds (JWT_EXPIRES_IN=15m)
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'default_jwt_refresh_secret_for_testing',
      expiresIn: 604800, // 7 days in seconds (JWT_REFRESH_EXPIRES_IN=7d)
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

    const payload = { 
      sub: user.id, 
      email: user.email, 
      isSuperAdmin: user.isSuperAdmin,
      campusId: user.campusId,
      permissions: user.role?.permissions || []
    };
    const { accessToken, refreshToken } = this.generateTokens(payload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        isSuperAdmin: user.isSuperAdmin,
        campusId: user.campusId,
        role: user.role?.name,
        permissions: user.role?.permissions || [],
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
      },
    };
  }

  async refresh(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid user status');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      isSuperAdmin: user.isSuperAdmin,
      campusId: user.campusId,
      permissions: (user as any).role?.permissions || []
    };
    return this.generateTokens(payload);
  }

  async getMe(userId: string) {
    return this.usersService.findOne(userId);
  }

  async logout(_userId: string) {
    // In production: add token to Redis blacklist with TTL = remaining token expiry
    return { success: true, message: 'Logged out successfully' };
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    // Always return success to prevent email enumeration attacks
    try {
      const user = await this.usersService.findByEmail(email);
      if (user && user.status === 'ACTIVE') {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
        // Generate a simple reset token (in production use a signed JWT with short expiry)
        const resetToken = this.jwtService.sign(
          { sub: user.id, email: user.email, type: 'password-reset' },
          { secret: this.configService.get<string>('JWT_SECRET') || 'default_jwt_secret_for_testing', expiresIn: '15m' },
        );
        await this.mailService.sendPasswordReset(
          user.email,
          `${user.firstName} ${user.lastName}`,
          resetToken,
          frontendUrl,
        );
      }
    } catch {
      // Silently ignore errors — never reveal if email exists
    }
    return { success: true, message: 'If an account with that email exists, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET') || 'default_jwt_secret_for_testing',
      });

      if (payload.type !== 'password-reset') {
        throw new BadRequestException('Invalid token type');
      }

      await this.usersService.resetPassword(payload.sub, newPassword);
      return { success: true, message: 'Password reset successfully' };
    } catch (e) {
      throw new BadRequestException('Invalid or expired password reset token');
    }
  }
}
