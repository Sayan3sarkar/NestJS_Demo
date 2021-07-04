import { IsEnum, isUppercase } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class UpdateTaskStatusDTO {
    @IsEnum(TaskStatus)
    public status: TaskStatus;
}