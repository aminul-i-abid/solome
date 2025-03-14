import { ProjectStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(ProjectStatus, {
    message: 'Status must be either IN_PROGRESS or COMPLETED',
  })
  status: ProjectStatus;
}
