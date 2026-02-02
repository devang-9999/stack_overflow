/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) { }

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.createQuestion(createQuestionDto);
  }

@Get("user/:userId/drafts")
getDrafts(@Param("userId") id: string) {
  return this.questionsService.getUserDrafts(+id);
}

@Get("user/:userId/published")
getPublished(@Param("userId") id: string) {
  return this.questionsService.getUserPublished(+id);
}

  // @Get()
  // findAll() {
  //   return this.questionsService.findAll();
  // }

  @Get()
findAll(
  @Query('search') search?: string,
  @Query('tags') tags?: string,
) {
  const tagList = tags ? tags.split(',') : [];
  return this.questionsService.findAll(search, tagList);
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.getById(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionsService.removeById(+id);
  }
  @Patch(":id/status")
updateStatus(
  @Param("id") id: string,
  @Body() body: { userId: number; status: "draft" | "published" }
) {
  return this.questionsService.updateStatus(
    +id,
    body.userId,
    body.status
  );
}

}
