import { Priority, TaskStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetTasksParamsDto {
  @IsNotEmpty()
  @IsString()
  project_id: string;

  @IsOptional()
  @IsEnum(Priority, { message: 'Priority must be LOW, MEDIUM, or HIGH' })
  priority: Priority;

  @IsOptional()
  @IsString()
  label_id: string;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status must be TODO, IN_PROGRESS, or COMPLETED',
  })
  status: TaskStatus;

  @IsOptional()
  @IsDateString()
  due_date: string;
}
