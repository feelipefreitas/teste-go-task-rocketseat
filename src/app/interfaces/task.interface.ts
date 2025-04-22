import { TaskStatus } from "../types/task-status";
import { ITaskComment } from "./task-comment.interface";

export interface ITask {
    id: string;
    name: string;
    description: string;
    comments: ITaskComment[];
    status: TaskStatus;
};