/* eslint-disable prettier/prettier */
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Users } from 'src/users/entities/user.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Question } from 'src/questions/entities/question.entity';



dotenv.config();

const rawDataSourceOptions = {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [Users,
            Tag, Question],
      migrations: [__dirname + "../database/migrations/*.ts"],
};

export const dataSourceOptions = rawDataSourceOptions as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
