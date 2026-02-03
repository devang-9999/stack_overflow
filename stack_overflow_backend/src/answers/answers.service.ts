/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */

import {
  ForbiddenException,
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
  ) {}

  async create(createAnswerDto: CreateAnswerDto) {
    const { text, questionId, userId, parentAnswerId } = createAnswerDto;

    const question = await this.questionsRepository.findOne({
      where: { id: questionId },
    });

    if (!question) throw new NotFoundException('Question not found');

    let parentAnswer: Answers | null = null;

    if (parentAnswerId) {
      parentAnswer = await this.answersRepository.findOne({
        where: { id: parentAnswerId },
      });
      if (!parentAnswer) {
        throw new NotFoundException('Parent answer not found');
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
        isDeleted: false,
      },
      relations: ['votes'],
      order: { createdAt: 'DESC' },
    });

    const result: any[] = [];

   for (const answer of answers) {
  const upVotes = answer.votes.filter(v => v.value === 1).length;
  const downVotes = answer.votes.filter(v => v.value === -1).length;

  result.push({
    id: answer.id,
    answer: answer.answer,
    userId: answer.userId,
    createdAt: answer.createdAt,
    isDeleted: answer.isDeleted,
    isValid: answer.isValid,
    myVote:
      answer.votes.find(v => v.userId === userId)?.value ?? 0,
    upVotes,
    downVotes,
    score: upVotes - downVotes,   
    replies: await this.loadReplies(answer.id, userId),
  });
}


    return result;
  }

  
  /* ---------------- RECURSIVE REPLIES ---------------- */
  private async loadReplies(answerId: number, userId: number) {
    const replies = await this.answersRepository.find({
      where: {
        parentAnswer: { id: answerId },
        isDeleted: false,
      },
      relations: ['votes'],
      order: { createdAt: 'ASC' },
    });

    const result: any[] = [];

 for (const reply of replies) {
  const upVotes = reply.votes.filter(v => v.value === 1).length;
  const downVotes = reply.votes.filter(v => v.value === -1).length;

  result.push({
    id: reply.id,
    answer: reply.answer,
    userId: reply.userId,
    createdAt: reply.createdAt,
    isDeleted: reply.isDeleted,
    isValid: reply.isValid,
    myVote:
      reply.votes.find(v => v.userId === userId)?.value ?? 0,
    upVotes,
    downVotes,
    score: upVotes - downVotes,
    replies: await this.loadReplies(reply.id, userId),
  });
}


    return result;
  }

  /* ---------------- VERIFY / UNVERIFY ANSWER ---------------- */
  async toggleValid(answerId: number, userId: number) {
    const answer = await this.answersRepository.findOne({
      where: { id: answerId },
      relations: ['question'],
    });

    if (!answer) throw new NotFoundException('Answer not found');

    // ONLY question owner
    if (answer.question.userId !== userId) {
      throw new ForbiddenException('Not allowed');
    }

    if (answer.isValid) {
      answer.isValid = false;
      answer.question.acceptedAnswer = null;
    } else {
      await this.answersRepository.update(
        { question: { id: answer.question.id } },
        { isValid: false },
      );

      answer.isValid = true;
      answer.question.acceptedAnswer = answer;
    }

    await this.answersRepository.save(answer);
    await this.questionsRepository.save(answer.question);

    return { message: 'Answer verification toggled' };
  }

  /* ---------------- ADMIN: SOFT DELETE / RESTORE ANSWER ---------------- */
  async adminToggleDelete(answerId: number) {
    const answer = await this.answersRepository.findOne({
      where: { id: answerId },
    });

    if (!answer) throw new NotFoundException('Answer not found');

    answer.isDeleted = !answer.isDeleted;
    await this.answersRepository.save(answer);

    return {
      message: answer.isDeleted
        ? 'Answer soft deleted'
        : 'Answer restored',
    };
  }

   async getAnswersByQuestionAdmin(questionId: number) {
    const answers = await this.answersRepository.find({
      where: {
        question: { id: questionId },
        parentAnswer: IsNull(),
      },
      order: { createdAt: 'DESC' },
    });

    return Promise.all(
      answers.map(async (answer) => ({
        id: answer.id,
        answer: answer.answer,
        userId: answer.userId,
        isDeleted: answer.isDeleted,
        replies: await this.loadRepliesAdmin(answer.id),
      }))
    );
  }

  private async loadRepliesAdmin(answerId: number) {
    const replies = await this.answersRepository.find({
      where: {
        parentAnswer: { id: answerId },
      },
      order: { createdAt: 'ASC' },
    });

    return Promise.all(
      replies.map(async (reply) => ({
        id: reply.id,
        answer: reply.answer,
        userId: reply.userId,
        isDeleted: reply.isDeleted,
        replies: await this.loadRepliesAdmin(reply.id),
      }))
    );
  }

}
