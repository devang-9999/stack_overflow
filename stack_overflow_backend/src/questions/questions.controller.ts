import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }

  @Get()
  findAll() {
    return this.questionsService.getAllQuestions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.getById(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.removeById(+id);
  }
}
