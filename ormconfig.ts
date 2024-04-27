import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import configuration, {
  DatabaseConfig,
} from './src/commons/config/configuration';

export const PostgresDataSourceOptions = (
  db: DatabaseConfig,
): DataSourceOptions => ({
  type: 'postgres',
  host: db.host,
  port: db.port,
  username: db.username,
  password: db.password,
  database: db.name,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: db.synchronize,
  migrationsRun: db.migrationsRun,
  logging: db.logging,
  namingStrategy: new SnakeNamingStrategy(),
});

export const AppDataSource = new DataSource(
  PostgresDataSourceOptions(configuration().database),
);
