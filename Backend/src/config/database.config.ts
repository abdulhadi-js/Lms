import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const host = configService.get<string>('DB_HOST', 'localhost');
  const isCloud = host !== 'localhost' && host !== '127.0.0.1';

  return {
    type: 'postgres',
    host,
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME', 'postgres'),
    password: configService.get<string>('DB_PASSWORD', 'postgres'),
    database: configService.get<string>('DB_NAME', 'educore_lms'),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: configService.get<string>('NODE_ENV') !== 'production',
    logging: configService.get<string>('NODE_ENV') === 'development',
    // SSL required for Neon and other cloud providers
    ssl: isCloud,
    extra: isCloud
      ? { ssl: { rejectUnauthorized: false } }
      : undefined,
  };
};
