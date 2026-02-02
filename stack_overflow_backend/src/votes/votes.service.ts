/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { Answers } from 'src/answers/entities/answer.entity';
import { CreateVoteDto } from './dto/create-vote.dto';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private voteRepo: Repository<Vote>,

    @InjectRepository(Answers)
    private answerRepo: Repository<Answers>,
  ) {}

  async vote(createVoteDto: CreateVoteDto) {
    const { answerId, userId, value } = createVoteDto;

    const answer = await this.answerRepo.findOne({
      where: { id: answerId },
    });

    if (!answer) throw new NotFoundException('Answer not found');

    const existingVote = await this.voteRepo.findOne({
      where: { userId, answer: { id: answerId } },
      relations: ['answer'],
    });


    if (existingVote && existingVote.value === value) {
      await this.voteRepo.remove(existingVote);
      console.log("vote removed")
      return { message: 'Vote removed' };
    }

    try {
    if (existingVote) {
      existingVote.value = value;
      await this.voteRepo.save(existingVote);
      return { message: 'Vote updated' };
    }
} catch (error) {
  throw new BadRequestException(error,'You already voted');
}

    // Here it will check whether the vote is new or not
    const vote = this.voteRepo.create({
      userId,
      value,
      answer,
    });

    await this.voteRepo.save(vote);
    console.log("Vote Added")
    return { message: 'Vote added' };
  }
}
