/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { AnswerService } from './answers.service';

@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  create(@Body() dto: CreateAnswerDto) {
    return this.answerService.create(dto);
  }

  @Get('question/:questionId')
  getByQuestion(
    @Param('questionId', ParseIntPipe) questionId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.answerService.getAnswersByQuestion(questionId, userId);
  }

    @Get('admin/question/:questionId')
  getByQuestionAdmin(
    @Param('questionId', ParseIntPipe) questionId: number,
  ) {
    return this.answerService.getAnswersByQuestionAdmin(questionId);
  }


  @Patch(':id/toggle-verify')
  toggleVerify(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { userId: number },
  ) {
    return this.answerService.toggleValid(id, body.userId);
  }

  @Patch(':id/admin-toggle-delete')
  adminToggleDelete(@Param('id', ParseIntPipe) id: number) {
    return this.answerService.adminToggleDelete(id);
  }
}
