import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(['IN_PROGRESS', 'COMPLETED'], {
    message: 'Status must be either IN_PROGRESS or COMPLETED',
  })
  status: 'IN_PROGRESS' | 'COMPLETED';
}
