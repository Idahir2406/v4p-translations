

import { config } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";
import { envs } from "src/config/envs";

config();

export const typeOrmConfig: DataSourceOptions = {
  type: "mysql",
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  port: envs.DB_PORT,
  synchronize: false,
  logging: true,
  migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
  host: envs.DB_HOST,
  username: envs.DB_USERNAME,
  password: envs.DB_PASSWORD,
  database: envs.DB_DATABASE,
}

export const dataSource = new DataSource(typeOrmConfig);