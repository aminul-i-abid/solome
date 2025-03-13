import { HttpStatus, Injectable } from '@nestjs/common';
import { hasValidPropertyValidator } from 'src/common/validators/has-valid-property.validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/utils/response.util';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

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

    return ResponseUtil.success(
      'Project created successfully',
      HttpStatus.CREATED,
    );
  }

  async getProjects(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        userId,
      },
    });

    return ResponseUtil.success('Retrieve all projects successfully', projects);
  }

  async updateProject(
    userId: string,
    projectId: string,
    body: UpdateProjectDto,
  ) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      return ResponseUtil.error('Project not found', HttpStatus.NOT_FOUND);
    }

    // Check if the body has at least one valid property to update
    hasValidPropertyValidator(body);

    await this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...body,
      },
    });

    return ResponseUtil.success('Project updated successfully');
  }
}
