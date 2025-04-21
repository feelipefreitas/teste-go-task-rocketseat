import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { ITaskFormControls } from '../components/task-form-modal/task-form-modal.component';

export interface ITask {
  id: string;
  name: string;
  description: string;
  comments: ITaskComment[];
  status: 'to-do' | 'doing' | 'done';
}

export interface ITaskComment {
  id: string;
  description: string;
  dayOfComment: string; //TODO: qual é a melhor forma de salver essa data
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Tarefas em A Fazer
  private toDoTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly toDoTasks = this.toDoTasks$.asObservable().pipe(
    map(tasks => tasks.map(task => ({ ...task, comments: [...task.comments] })))
  );

  // Tarefas em Fazendo
  private doingTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly doingTasks = this.doingTasks$.asObservable().pipe(
    map(tasks => tasks.map(task => ({ ...task, comments: [...task.comments] })))
  );

  // Tarefas em Concluído
  private doneTasks$ = new BehaviorSubject<ITask[]>([]);
  readonly doneTasks = this.doneTasks$.asObservable().pipe(
    map(tasks => tasks.map(task => ({ ...task, comments: [...task.comments] })))
  );

  addTask(taskInfos: ITaskFormControls) {
    const newTask: ITask = {
      ...taskInfos,
      status: 'to-do',
      id: this.generateUniqueIdWithTimestamp(),
      comments: [],
    };

    const currentList = this.toDoTasks$.value;

    this.toDoTasks$.next([...currentList, newTask]);
  }

  updateTaskStatus(taskId: string, taskCurrentStatus: string, taskNextStatus: string) {
    console.log('Atualizando status da tarefa: ', taskId, taskCurrentStatus, taskNextStatus);
  }

  private generateUniqueIdWithTimestamp(): string {
    const timestamp = new Date().getTime().toString(36); // Convert current timestamp to base 36
    const randomPart = Math.random().toString(36).substring(2, 9); // Shorter random part
    return `${timestamp}-${randomPart}`;
  }
}
