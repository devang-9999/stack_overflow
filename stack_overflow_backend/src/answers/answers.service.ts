/* eslint-disable prettier/prettier */

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

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
  ) { }


async create(createAnswerDto: CreateAnswerDto) {
  const { text, questionId, userId, parentAnswerId } = createAnswerDto;

  const question = await this.questionsRepository.findOne({
    where: { id: questionId },
  });

  if (!question) {
    throw new NotFoundException('Question not found');
  }

  let parentAnswer: Answers | null = null;

  if (parentAnswerId) {
    parentAnswer = await this.answersRepository.findOne({
      where: { id: parentAnswerId },
    });

    if (!parentAnswer) {
      throw new NotFoundException('Parent answer not found');
    }
  }

  if (!parentAnswerId) {
    const existingAnswer = await this.answersRepository.findOne({
      where: {
        userId,
        question: { id: questionId },
        parentAnswer: IsNull(),
      },
    });

    if (existingAnswer) {
      existingAnswer.answer = text;
      await this.answersRepository.save(existingAnswer);
      return { message: 'Answer updated', answerId: existingAnswer.id };
    }
  }

  const answer = this.answersRepository.create({
    answer: text,
    question,
    userId,
    parentAnswer,
  });

  await this.answersRepository.save(answer);

  return {
    message: parentAnswerId ? 'Reply added' : 'Answer created',
    answerId: answer.id,
  };
}


async getAnswersByQuestion(questionId: number, userId: number) {
  const answers = await this.answersRepository.find({
    where: {
      question: { id: questionId },
      parentAnswer: IsNull(), 
    },
    relations: [
      'votes',
      'replies',
      'replies.votes',
    ],
    order: {
      createdAt: 'DESC',
      replies: {
        createdAt: 'ASC',
      },
    },
  });

  return answers.map((answer) => ({
    id: answer.id,
    answer: answer.answer,
    userId: answer.userId,
    createdAt: answer.createdAt,
    myVote:
      answer.votes.find((v) => v.userId === userId)?.value ?? 0,

    replies: answer.replies.map((reply) => ({
      id: reply.id,
      answer: reply.answer,
      userId: reply.userId,
      createdAt: reply.createdAt,
      myVote:
        reply.votes.find((v) => v.userId === userId)?.value ?? 0,
    })),
  }));
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
