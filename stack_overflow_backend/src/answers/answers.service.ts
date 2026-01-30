/* eslint-disable prettier/prettier */

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Answers } from './entities/answer.entity';
import { Question } from 'src/questions/entities/question.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answers)
    private readonly answersRepository: Repository<Answers>,

    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ) {}


  async create(createAnswerDto: CreateAnswerDto) {
    const { text, questionId, userId } = createAnswerDto;

    const question = await this.questionsRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const answer = this.answersRepository.create({
      answer: text,
      question,
      userId,
    });

    await this.answersRepository.save(answer);

    return {
      message: 'Answer created successfully',
      answerId: answer.id,
    };
  }

 
  async getAnswersByQuestion(questionId: number) {
    return this.answersRepository.find({
      where: {
        question: { id: questionId },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  
  async getAnswerById(id: number) {
    const answer = await this.answersRepository.findOne({
      where: { id },
      relations: ['question'],
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    return answer;
  }

 
  async markAsValid(id: number) {
    const answer = await this.getAnswerById(id);

    answer.isValid = true;
    await this.answersRepository.save(answer);

    return {
      message: 'Answer marked as valid',
    };
  }
}
