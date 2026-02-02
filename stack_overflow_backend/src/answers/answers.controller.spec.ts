import { Test, TestingModule } from '@nestjs/testing';
import { AnswerController } from './answers.controller';
import { AnswerService } from './answers.service';

describe('AnswersController', () => {
  let controller: AnswerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerController],
      providers: [AnswerService],
    }).compile();

    controller = module.get<AnswerController>(AnswerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
