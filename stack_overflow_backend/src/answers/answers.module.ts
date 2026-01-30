/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answers } from './entities/answer.entity';
import { AnswerController } from './answers.controller';
import { AnswerService } from './answers.service';
import { Question } from 'src/questions/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Answers]), TypeOrmModule.forFeature([Question])],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}