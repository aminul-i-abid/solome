import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { LabelsService } from './labels.service';

@Controller('labels')
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Post()
  createLabel(@Req() req: Request, @Body() createLabelDto: CreateLabelDto) {
    return this.labelsService.createLabel(req.user.userId, createLabelDto);
  }

  @Get()
  getLabels(@Req() req: Request) {
    return this.labelsService.getLabels(req.user.userId);
  }

  @Patch(':labelId')
  updateLabel(@Req() req: Request, @Body() updateLabelDto: UpdateLabelDto) {
    return this.labelsService.updateLabel(
      req.user.userId,
      req.params.labelId,
      updateLabelDto,
    );
  }
}
