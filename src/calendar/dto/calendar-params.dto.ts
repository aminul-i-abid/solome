import { Priority } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CalendarParamsDto {
  @IsOptional()
  @IsDateString()
  due_date: string;

  @IsOptional()
  @IsString()
  label_id: string;

  @IsOptional()
  @IsEnum(Priority, { message: 'Priority must be either LOW, MEDIUM, or HIGH' })
  priority: Priority;
}
