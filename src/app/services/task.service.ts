import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { ITaskFormControls } from '../components/task-form-modal/task-form-modal.component';

export enum TaskStatusEnum {
  TODO = 'to-do',
  DOING = 'doing',
  DONE = 'done',
};

export type TaskStatus = TaskStatusEnum.TODO | TaskStatusEnum.DOING | TaskStatusEnum.DONE;

export interface ITask {
  id: string;
  name: string;
  description: string;
  comments: ITaskComment[];
  status: TaskStatus;
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
      status: TaskStatusEnum.TODO,
      id: this.generateUniqueIdWithTimestamp(),
      comments: [],
    };

    const currentList = this.toDoTasks$.value;

    this.toDoTasks$.next([...currentList, newTask]);
  }

  updateTaskStatus(taskId: string, taskCurrentStatus: TaskStatus, taskNextStatus: TaskStatus) {
    console.log('Atualizando status da tarefa: ', taskId, taskCurrentStatus, taskNextStatus);

    // Não recebo toda a tarefa do componente por parâmetro pois pode ser que o objeto tenha sofrido alguma alteração

    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const nextTaskList = this.getTaskListByStatus(taskNextStatus);
    const currentTask = currentTaskList.value.find(task => task.id === taskId);

    if (currentTask) {
      // Atualizando status da tarefa
      currentTask.status = taskNextStatus;

      // Removendo tarefa da lista atual
      const currentTaskListWithoutTask = currentTaskList.value.filter(task => task.id !== taskId);
      currentTaskList.next([...currentTaskListWithoutTask]);

      // Adicionando tarefa na nova lista
      nextTaskList.next([...nextTaskList.value, { ...currentTask }]);
    }

  }

  private getTaskListByStatus(taskStatus: TaskStatus) {
    const taskListObj = {
      [TaskStatusEnum.TODO]: this.toDoTasks$,
      [TaskStatusEnum.DOING]: this.doingTasks$,
      [TaskStatusEnum.DONE]: this.doneTasks$,
    };

    return taskListObj[taskStatus];
  }

  private generateUniqueIdWithTimestamp(): string {
    const timestamp = new Date().getTime().toString(36); // Convert current timestamp to base 36
    const randomPart = Math.random().toString(36).substring(2, 9); // Shorter random part
    return `${timestamp}-${randomPart}`;
  }
}
