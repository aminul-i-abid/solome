import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/utils/response.util';
import { CalendarParamsDto } from './dto/calendar-params.dto';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async getAllInProgressTasks(userId: string, params: CalendarParamsDto) {
    const getAllProjectIds = await this.prisma.project.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    const projectIds = getAllProjectIds.map((project) => project.id);

    const inProgressTasks = await this.prisma.task.findMany({
      where: {
        dueDate: params.due_date,
        labelId: params.label_id,
        priority: params.priority,
        projectId: {
          in: projectIds,
        },
        status: 'IN_PROGRESS',
      },
    });

    return ResponseUtil.success(
      'Successfully fetched all in progress tasks',
      inProgressTasks,
    );
  }
}
