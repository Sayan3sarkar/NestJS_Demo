import { User } from 'src/auth/user.entity';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  public async getAllTasks(
    filterDTO: GetTasksFilterDTO,
    user: User,
  ): Promise<Task[]> {
    const { search, status } = filterDTO;

    const query = this.createQueryBuilder('task');

    query.where({ user }); // This fetches tasks only for the current user

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      // query.andWhere(
      //   new Brackets((qb) => {
      //     qb.where(
      //       'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.desc) LIKE LOWER(:search)',
      //       { search: `%${search}%` },
      //     );
      //   }),
      //   // Useful when filtering combining status and search. Equivalent to:
      //   // status = status AND (title LIKE search OR description LIKE search)
      // );

      // Alternate to above code
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.desc) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  public async createTask(
    createTaskDTO: CreateTaskDTO,
    user: User,
  ): Promise<Task> {
    const { title, desc } = createTaskDTO;

    const newTask = this.create({
      title,
      desc,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(newTask);
    return newTask;
  }
}
