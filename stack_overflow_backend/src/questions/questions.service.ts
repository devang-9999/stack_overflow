/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/tags/entities/tag.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,

    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) { }


  
  async createQuestion(createQuestionDto: CreateQuestionDto) {
    const { userId, tags, ...questionData } = createQuestionDto;

    const existingTags = await this.tagsRepository.find({
      where: tags.map((name) => ({ name })),
    });

    const existingTagNames = existingTags.map((t) => t.name);

    const newTags = tags
      .filter((name) => !existingTagNames.includes(name))
      .map((name) =>
        this.tagsRepository.create({ name }),
      );


    const allTags = [...existingTags, ...newTags];
    

    const question = this.questionsRepository.create({
      ...questionData,
      user: { id: userId },
      tags: allTags,
    });

    const saved = await this.questionsRepository.save(question);

    return await this.questionsRepository.findOne({
      where: { id: saved.id },
      relations: ['user', 'tags'],
    });
  }

  getAllQuestions() {
    return this.questionsRepository.find(
      {
        relations: ['user', 'tags'],
      }
    );
  }


  async getById(id: number) {
    const question = await this.questionsRepository.findOneBy({ id: id });
    if (!question) {
      throw new NotFoundException("Question not found");
    }
    return this.questionsRepository.findOne({
      where :{id:id},
     relations: ['user', 'tags'],
    })
  }


  async removeById(id: number) {
    const question = await this.questionsRepository.findOne({
      where: { id: id }
    });

    if (!question) {
      throw new NotFoundException("Question not found")
    }
    return await this.questionsRepository.remove(question)
  }
}
