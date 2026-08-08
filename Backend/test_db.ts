import { DataSource } from 'typeorm';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const db = new DataSource({
  type: 'better-sqlite3',
  database: 'database.sqlite',
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
  logging: true,
});

db.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
    process.exit(1);
  });
