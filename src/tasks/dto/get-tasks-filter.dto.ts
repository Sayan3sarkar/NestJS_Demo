import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTasksFilterDTO {
    @IsOptional()
    @IsEnum(TaskStatus)
    public status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    public search: string;
}