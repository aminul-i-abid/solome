import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/utils/response.util';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}
  async createProject(userId: string, body: CreateProjectDto) {
    await this.prisma.project.create({
      data: {
        userId,
        ...body,
      },
    });

    return ResponseUtil.success('Project created successfully');
  }
}
