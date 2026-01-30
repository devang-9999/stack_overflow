/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data_source/data_source';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswerModule } from './answers/answers.module';
import { VotesModule } from './votes/votes.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({...dataSourceOptions}),
    UsersModule,
    TagsModule,
    QuestionsModule,
    AnswerModule,
    VotesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}