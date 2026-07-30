import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const dbUrl = configService.get<string>('DATABASE_URL');
  if (dbUrl) {
    return {
      type: 'postgres',
      url: dbUrl,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      // SAFETY: Temporarily enabling sync in production to auto-create tables on Render
      synchronize: true,
      logging: configService.get<string>('NODE_ENV') === 'development',
      ssl: true,
      extra: { ssl: { rejectUnauthorized: false } },
    };
  }

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
    // SAFETY: Temporarily enabling sync in production to auto-create tables on Render
    synchronize: true,
    logging: configService.get<string>('NODE_ENV') === 'development',
    ssl: isCloud,
    extra: isCloud
      ? { ssl: { rejectUnauthorized: false } }
      : undefined,
  };
};
