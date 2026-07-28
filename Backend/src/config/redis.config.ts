import { ConfigService } from '@nestjs/config';

export const getRedisConfig = (configService: ConfigService) => {
  const host = configService.get<string>('REDIS_HOST', 'localhost');
  const password = configService.get<string>('REDIS_PASSWORD');
  // Upstash and other cloud Redis providers require TLS
  const isCloud = host !== 'localhost' && host !== '127.0.0.1';

  return {
    host,
    port: configService.get<number>('REDIS_PORT', 6379),
    ...(password ? { password } : {}),
    ...(isCloud ? { tls: {} } : {}),
  };
};
