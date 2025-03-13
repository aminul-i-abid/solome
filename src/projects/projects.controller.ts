import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
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

  @Get()
  async getProjects(@Req() req: Request) {
    return this.projectsService.getProjects(req.user.userId);
  }

  @Patch(':projectId')
  async updateProject(
    @Req() req: Request,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(
      req.user.userId,
      req.params.projectId,
      updateProjectDto,
    );
  }
}
