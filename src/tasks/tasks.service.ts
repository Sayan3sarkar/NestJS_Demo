import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
// import {v4 as uuid} from 'uuid';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  public getAllTasks(
    filterDTO: GetTasksFilterDTO,
    user: User,
  ): Promise<Task[]> {
    return this.tasksRepository.getAllTasks(filterDTO, user);
  }

  public async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id, user } });
    if (!task) {
      throw new NotFoundException(`No Task with id ${id} found`);
    }
    return task;
  }

  public createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDTO, user);
  }

  public async deleteTaskById(id: string, user: User): Promise<void> {
    const task = await this.tasksRepository.delete({ id, user });

    if (task.affected === 0) {
      throw new NotFoundException(`No task with id ${id} found`);
    }
  }

  public async updateTaskStatusById(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const updatedTask = await this.getTaskById(id, user);

    updatedTask.status = status;
    await this.tasksRepository.save(updatedTask);

    return updatedTask;
  }
}
