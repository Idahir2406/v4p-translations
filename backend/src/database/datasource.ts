
import { DataSource, DataSourceOptions } from "typeorm";
import { envs } from "../config/envs";

export const typeOrmConfig: DataSourceOptions = {
  type: "mariadb",
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  port: envs.DB_PORT,
  synchronize: false,
  logging: false,
  migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
  host: envs.DB_HOST,
  username: envs.DB_USERNAME,
  password: envs.DB_PASSWORD,
  database: envs.DB_DATABASE,
}

export const dataSource = new DataSource(typeOrmConfig);