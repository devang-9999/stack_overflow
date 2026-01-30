/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';


import { CreateAnswerDto } from './dto/create-answer.dto';
import { AnswerService } from './answers.service';

@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}


  @Post()
  create(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.create(createAnswerDto);
  }

  
  @Get('question/:questionId')
  getByQuestion(
    @Param('questionId', ParseIntPipe) questionId: number,
  ) {
    return this.answerService.getAnswersByQuestion(questionId);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.answerService.getAnswerById(id);
  }

  
  @Patch(':id/validate')
  markAsValid(@Param('id', ParseIntPipe) id: number) {
    return this.answerService.markAsValid(id);
  }
}
