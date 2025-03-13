import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/utils/response.util';
import { CreateLabelDto } from './dto/create-label.dto';

@Injectable()
export class LabelsService {
  constructor(private prisma: PrismaService) {}

  async createLabel(userId: string, body: CreateLabelDto) {
    await this.prisma.label.create({
      data: {
        userId,
        ...body,
      },
    });

    return ResponseUtil.success(
      'Label created successfully',
      null,
      HttpStatus.CREATED,
    );
  }

  async getLabels(userId: string) {
    const labels = await this.prisma.label.findMany({
      where: {
        userId,
      },
    });

    return ResponseUtil.success('Successfully fetched labels', labels);
  }
}
