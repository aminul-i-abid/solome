import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { hasValidPropertyValidator } from 'src/common/validators/has-valid-property.validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/utils/response.util';
import { GetTasksParamsDto } from './dto/get-tasks-params.dto';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private async hasValidProjectId(userId: string, projectId: string) {
    const projectIds = await this.prisma.project.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

    // Check if the project ID is owned by the user
    const isOwnedProject = projectIds.some(
      (project) => project.id === projectId,
    );

    if (!isOwnedProject) {
      throw new NotFoundException('Project not found');
    }

    return true;
  }

  async createTask(userId: string, body: TaskDto) {
    if (!body.projectId) {
      throw new BadRequestException('Project ID is required');
    }

    await this.hasValidProjectId(userId, body.projectId);
    try {
      // Use a transaction to ensure atomicity
      await this.prisma.$transaction(async (prisma) => {
        // Create the task
        const task = await prisma.task.create({
          data: {
            projectId: body.projectId,
            labelId: body.labelId,
            title: body.title,
            content: body.content,
            dueDate: body.dueDate,
            priority: body.priority,
            attachments: body.attachments,
            status: body.status,
            comments: body.comments,
          },
        });

        // Create subtasks
        if (body.subTasks && body.subTasks.length > 0) {
          await Promise.all(
            body.subTasks.map(async (subTask) => {
              return await prisma.subTask.create({
                data: {
                  taskId: task.id,
                  todo: subTask.todo,
                  isComplete: subTask.isComplete,
                },
              });
            }),
          );
        }

        // Create time log
        if (body.timeLog) {
          await prisma.timeLog.create({
            data: {
              taskId: task.id,
              startTime: body.timeLog.startTime,
              endTime: body.timeLog.endTime,
              duration: body.timeLog.duration,
            },
          });
        }
      });

      return ResponseUtil.success(
        'Task created successfully',
        null,
        HttpStatus.CREATED,
      );
    } catch (error) {
      Logger.error(error);
      return ResponseUtil.error(
        'Failed to create task',
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR],
      );
    }
  }

  async getTasks(userId: string, params: GetTasksParamsDto) {
    await this.hasValidProjectId(userId, params.project_id);

    const tasks = await this.prisma.task.findMany({
      where: {
        projectId: params.project_id,
        labelId: params.label_id,
        dueDate: params.due_date,
        priority: params.priority,
        status: params.status,
      },
      include: {
        SubTask: true,
        TimeLog: true,
      },
    });

    return ResponseUtil.success('Retrieve all tasks successfully', tasks);
  }

  async updateTask(taskId: string, body: TaskDto) {
    // Check if the body has at least one valid property to update
    hasValidPropertyValidator(body);

    if (body.timeLog && !body.timeLog.id) {
      throw new BadRequestException('Time log ID is required');
    }
    try {
      // Use a transaction to ensure atomicity
      await this.prisma.$transaction(async (prisma) => {
        // Update the task
        const task = await prisma.task.update({
          where: { id: taskId },
          data: {
            projectId: body.projectId,
            labelId: body.labelId,
            title: body.title,
            content: body.content,
            dueDate: body.dueDate,
            priority: body.priority,
            attachments: body.attachments,
            status: body.status,
            comments: body.comments,
          },
        });

        // Update subtasks
        if (body.subTasks && body.subTasks.length > 0) {
          await Promise.all(
            body.subTasks.map(async (subTask) => {
              if (subTask.id) {
                // Update existing subtask
                return await prisma.subTask.update({
                  where: { id: subTask.id },
                  data: {
                    todo: subTask.todo,
                    isComplete: subTask.isComplete,
                  },
                });
              } else {
                // Create new subtask
                return await prisma.subTask.create({
                  data: {
                    taskId: task.id,
                    todo: subTask.todo,
                    isComplete: subTask.isComplete,
                  },
                });
              }
            }),
          );
        }

        // Update time log
        if (body.timeLog) {
          await prisma.timeLog.update({
            where: { id: body.timeLog.id },
            data: {
              startTime: body.timeLog.startTime,
              endTime: body.timeLog.endTime,
              duration: body.timeLog.duration,
            },
          });
        }

        return task;
      });

      return ResponseUtil.success(
        'Task updated successfully',
        null,
        HttpStatus.OK,
      );
    } catch (error) {
      Logger.error(error);
      return ResponseUtil.error(
        'Failed to update task',
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR],
      );
    }
  }

  async deleteTask(taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return ResponseUtil.error(
        'Task not found',
        HttpStatus.NOT_FOUND,
        HttpStatus[HttpStatus.NOT_FOUND],
      );
    }

    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return ResponseUtil.success('Task deleted successfully');
  }
}
