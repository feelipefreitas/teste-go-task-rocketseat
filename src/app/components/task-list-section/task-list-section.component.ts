import { Component, inject } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { ITask, TaskService, TaskStatus, TaskStatusEnum } from '../../services/task.service';
import { AsyncPipe } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-task-list-section',
  imports: [TaskCardComponent, AsyncPipe, CdkDropList, CdkDrag],
  templateUrl: './task-list-section.component.html',
  styleUrl: './task-list-section.component.css'
})
export class TaskListSectionComponent {
  toDoTasksDropList: ITask[] = [];
  doingTasksDropList: ITask[] = [];
  doneTasksDropList: ITask[] = [];

  readonly _taskService = inject(TaskService);

  ngOnInit() {
    // this._taskService.toDoTasks.subscribe((toDoTasks) => {
    //   console.warn('Lista atual de tarefas TOdO: ', toDoTasks);
    //   this.toDoTasksDropList = toDoTasks;
    // });
    // this._taskService.doingTasks.subscribe((doingTasks) => {
    //   console.warn('Lista atual de tarefas doing: ', doingTasks);
    //   this.doingTasksDropList = doingTasks;
    // });
    // this._taskService.doneTasks.subscribe((doneTasks) => {
    //   console.warn('Lista atual de tarefas done: ', doneTasks);
    //   this.doneTasksDropList = doneTasks;
    // });
  }

  onCardDrop(event: CdkDragDrop<ITask[]>) {
    this.moveCardToColumn(event);

    const taskId = event.item.data.id;
    const taskCurrentStatus = event.item.data.status;
    const droppedColumn = event.container.id;

    this.updateTaskStatus(taskId, taskCurrentStatus, droppedColumn);
  }

  private updateTaskStatus(taskId: string, taskCurrentStatus: TaskStatus, droppedColumn: string) {
    let taskNextStatus: TaskStatus;

    switch (droppedColumn) {
      case 'to-do-column':
        taskNextStatus = TaskStatusEnum.TODO;
        break;
      case 'doing-column':
        taskNextStatus = TaskStatusEnum.DOING;
        break;
      case 'done-column':
        taskNextStatus = TaskStatusEnum.DONE;
        break;
      default:
        throw Error('Coluna não localizada.');
    }

    this._taskService.updateTaskStatus(taskId, taskCurrentStatus, taskNextStatus);
  }

  private moveCardToColumn(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}

