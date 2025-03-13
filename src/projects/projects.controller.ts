import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async createProject(
    @Req() req: Request,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.createProject(
      req.user.userId,
      createProjectDto,
    );
  }
}
