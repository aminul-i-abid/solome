import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateLabelDto } from './dto/create-label.dto';
import { LabelsService } from './labels.service';

@Controller('labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Post()
  createLabel(@Req() req: Request, @Body() createLabelDto: CreateLabelDto) {
    return this.labelsService.createLabel(req.user.userId, createLabelDto);
  }
}
