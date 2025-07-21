import 'dotenv/config';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'appdb',
  synchronize: false, // Use migrations for schema changes
  logging: true,
  entities: [process.cwd() + '/src/domains/*.ts'],
  migrations: [process.cwd() + '/src/migrations/*.ts'],
  subscribers: [],
});

export default AppDataSource;
