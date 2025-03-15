import { Priority, TaskStatus } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

class SubTaskDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  todo: string;

  @IsOptional()
  @IsBoolean()
  isComplete: boolean;
}

class TimeLogDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsDateString()
  startTime: string;

  @IsOptional()
  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsString()
  duration: string;
}

export class TaskDto {
  @IsOptional()
  @IsString()
  projectId: string;

  @IsOptional()
  @IsString()
  labelId: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsEnum(Priority, { message: 'Priority must be LOW, MEDIUM, or HIGH' })
  priority: Priority;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments: string[];

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status must be TODO, IN_PROGRESS, or COMPLETED',
  })
  status: TaskStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  comments: string[];

  @IsOptional()
  @IsArray()
  subTasks: SubTaskDto[];

  @IsOptional()
  timeLog: TimeLogDto;
}
