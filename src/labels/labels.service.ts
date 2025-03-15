import { HttpStatus, Injectable } from '@nestjs/common';
import { hasValidPropertyValidator } from 'src/common/validators/has-valid-property.validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/utils/response.util';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';

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

  async updateLabel(userId: string, labelId: string, body: UpdateLabelDto) {
    // Check if the body has at least one valid property to update
    hasValidPropertyValidator(body);

    await this.prisma.label.update({
      where: {
        userId,
        id: labelId,
      },
      data: {
        ...body,
      },
    });

    return ResponseUtil.success('Label updated successfully');
  }

  async deleteLabel(labelId: string) {
    const label = await this.prisma.label.findFirst({
      where: {
        id: labelId,
      },
    });

    if (!label) {
      return ResponseUtil.error(
        'Label not found',
        HttpStatus.NOT_FOUND,
        HttpStatus[HttpStatus.NOT_FOUND],
      );
    }

    await this.prisma.label.delete({
      where: {
        id: labelId,
      },
    });

    return ResponseUtil.success('Label deleted successfully');
  }
}
