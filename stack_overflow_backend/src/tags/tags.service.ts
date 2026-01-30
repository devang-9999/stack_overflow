/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  async create(dto: CreateTagDto) {
    const tag = this.tagsRepository.create(dto);
    return this.tagsRepository.save(tag);
  }

  async findAll() {
    return this.tagsRepository.find(
      {
        relations:["questions"]
      }
    );
  }
}

