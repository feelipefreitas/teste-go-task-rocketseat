import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { generateUniqueIdWithTimestamp } from '../utils/generate-unique-id-with-timestamp';
import { TaskStatusEnum } from '../enums/task-status.enum';
import { ITask } from '../interfaces/task.interface';
import { TaskStatus } from '../types/task-status';
import { ITaskComment } from '../interfaces/task-comment.interface';
import { ITaskFormControls } from '../interfaces/task-form-controls.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Tarefas em A Fazer
  private toDoTasks$ = new BehaviorSubject<ITask[]>(this.loadTasksFromLocalStorage(TaskStatusEnum.TODO));
  readonly toDoTasks = this.toDoTasks$.asObservable().pipe(
    map(tasks => tasks.map(task => ({ ...task, comments: [...task.comments] }))),
    tap(tasks => this.saveTasksOnLocalStorage(TaskStatusEnum.TODO, tasks))
  );

  // Tarefas em Fazendo
  private doingTasks$ = new BehaviorSubject<ITask[]>(this.loadTasksFromLocalStorage(TaskStatusEnum.DOING));
  readonly doingTasks = this.doingTasks$.asObservable().pipe(
    map(tasks => tasks.map(task => ({ ...task, comments: [...task.comments] }))),
    tap(tasks => this.saveTasksOnLocalStorage(TaskStatusEnum.DOING, tasks))
  );

  // Tarefas em Concluído
  private doneTasks$ = new BehaviorSubject<ITask[]>(this.loadTasksFromLocalStorage(TaskStatusEnum.DONE));
  readonly doneTasks = this.doneTasks$.asObservable().pipe(
    map(tasks => tasks.map(task => ({ ...task, comments: [...task.comments] }))),
    tap(tasks => this.saveTasksOnLocalStorage(TaskStatusEnum.DONE, tasks))
  );

  addTask(taskInfos: ITaskFormControls) {
    const newTask: ITask = {
      ...taskInfos,
      status: TaskStatusEnum.TODO,
      id: generateUniqueIdWithTimestamp(),
      comments: [],
    };

    const currentList = this.toDoTasks$.value;

    this.toDoTasks$.next([...currentList, newTask]);
  }

  updateTaskStatus(taskId: string, taskCurrentStatus: TaskStatus, taskNextStatus: TaskStatus) {
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

  updateTaskNameAndDescription(taskId: string, taskCurrentStatus: TaskStatus, newTaskName: string, newTaskDescription: string) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const currentTaskIndex = currentTaskList.value.findIndex(task => task.id === taskId);

    if (currentTaskIndex > -1) {
      const updatedTaskList = [...currentTaskList.value];

      updatedTaskList[currentTaskIndex] = {
        ...updatedTaskList[currentTaskIndex],
        name: newTaskName,
        description: newTaskDescription,
      };

      currentTaskList.next(updatedTaskList);
    }
  }

  updateTaskComments(taskId: string, taskCurrentStatus: TaskStatus, newTaskComments: ITaskComment[]) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
    const currentTaskIndex = currentTaskList.value.findIndex(task => task.id === taskId);

    if (currentTaskIndex > -1) {
      const updatedTaskList = [...currentTaskList.value];

      updatedTaskList[currentTaskIndex] = {
        ...updatedTaskList[currentTaskIndex],
        comments: [...newTaskComments],
      };

      currentTaskList.next(updatedTaskList);
    }
  }

  deleteTask(taskId: string, taskCurrentStatus: TaskStatusEnum) {
    const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);

    const newTaskList = currentTaskList.value.filter(task => task.id !== taskId);

    currentTaskList.next(newTaskList);
  }

  private loadTasksFromLocalStorage(key: string): ITask[] {
    try {
      const storedTasks = localStorage.getItem(key);
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error('Erro ao carregar tarefas do localStorage:', error);
      return [];
    }
  }

  private saveTasksOnLocalStorage(key: string, tasks: ITask[]) {
    try {
      localStorage.setItem(key, JSON.stringify(tasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas no localStorage:', error);
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
}
