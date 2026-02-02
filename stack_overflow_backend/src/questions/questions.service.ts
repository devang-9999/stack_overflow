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
    console.log(createQuestionDto, 'Question')
    const { userId, status,tags, ...questionData } = createQuestionDto;

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
      status: status ?? "published",
      user: { id: userId },
      tags: allTags,
      
    });

    const saved = await this.questionsRepository.save(question);

    return await this.questionsRepository.findOne({
      where: { id: saved.id },
      relations: ['user', 'tags'],
    });
  }

// async findAll() {
//   return this.questionsRepository.find({
//     where: { status: "published" },
//     relations: ['user', 'tags'],
//     order: { id: "DESC" },
//   });
// }

async findAll(search?: string, tags: string[] = []) {
  
  let questions = await this.questionsRepository.find({
    where: { status: 'published' },
    relations: ['user', 'tags'],
    order: { id: 'DESC' },
  });

  if (search) {
    const lowerSearch = search.toLowerCase();
    questions = questions.filter((q) =>
      q.title.toLowerCase().includes(lowerSearch),
    );
  }

  if (tags.length > 0) {
    questions = questions.filter((q) =>
      q.tags.some((tag) => tags.includes(tag.name)),
    );
  }

  return questions;
}



  async getById(id: number) {
    const question = await this.questionsRepository.findOneBy({ id: id });
    if (!question) {
      throw new NotFoundException("Question not found");
    }
    return this.questionsRepository.findOne({
      where: { id: id },
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

async getUserDrafts(userId: number) {
  return this.questionsRepository.find({
    where: {
      user: { id: userId },
      status: "draft",
    },
    relations: ['tags'],
    order: { id: 'DESC' },
  });
}


async getUserPublished(userId: number) {
  return this.questionsRepository.find({
    where: {
      user: { id: userId },
      status: "published",
    },
    relations: ['tags'],
    order: { id: 'DESC' },
  });
}

async updateStatus(
  id: number,
  userId: number,
  status: "draft" | "published"
) {
  const question = await this.questionsRepository.findOne({
    where: { id, user: { id: userId } },
  });

  if (!question) {
    throw new NotFoundException("Question not found");
  }

  question.status = status;

  return this.questionsRepository.save(question);
}


}
