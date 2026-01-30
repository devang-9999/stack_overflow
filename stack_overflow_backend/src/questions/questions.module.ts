/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Question } from './entities/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/tags/entities/tag.entity';
import { Answers } from 'src/answers/entities/answer.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Question]),TypeOrmModule.forFeature([Tag]),TypeOrmModule.forFeature([Answers])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}
