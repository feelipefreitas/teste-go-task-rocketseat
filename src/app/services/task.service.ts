import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ITask {
  id: string;
  title: string;
  description: string;
  comments: ITaskComment[];
  status: 'to-do' | 'doing' | 'done';
}

export interface ITaskComment {
  id: string;
  description: string;
  dayOfComment: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Tarefas em A Fazer
  private toDoTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly toDoTasks = this.toDoTasks$.asObservable();

  // Tarefas em Fazendo
  private doingTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly doingTasks = this.doingTasks$.asObservable();

  // Tarefas em Concluído
  private doneTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly doneTasks = this.doneTasks$.asObservable();

  generateUniqueIdWithTimestamp(): string {
    const timestamp = new Date().getTime().toString(36); // Convert current timestamp to base 36
    const randomPart = Math.random().toString(36).substring(2, 9); // Shorter random part
    return `${timestamp}-${randomPart}`;
  }
}
