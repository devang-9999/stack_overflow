/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { Vote } from './entities/vote.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answers } from 'src/answers/entities/answer.entity';

@Module({
  imports :[TypeOrmModule.forFeature([Vote]),TypeOrmModule.forFeature([Answers])],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
