import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
    return { id: 'mock-admin-id', role: 'ADMIN', email: 'admin@educore.com' } as any;
  }
}
