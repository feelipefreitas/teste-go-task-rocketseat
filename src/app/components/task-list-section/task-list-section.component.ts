import { Component, inject } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { ITask, TaskService } from '../../services/task.service';
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

  ngOnInit() { }

  onCardDrop(event: CdkDragDrop<ITask[]>) {
    this.moveCardToColumn(event);

    const taskId = event.item.data.id;
    const taskCurrentStatus = event.item.data.status;
    const droppedColumn = event.container.id;

    this.updateTaskStatus(taskId, taskCurrentStatus, droppedColumn);
    console.log(event)
  }

  private updateTaskStatus(taskId: string, taskCurrentStatus: string, droppedColumn: string) {
    let taskNextStatus = '';

    switch (droppedColumn) {
      case 'to-do-column':
        taskNextStatus = 'to-do';
        break;
      case 'doing-column':
        taskNextStatus = 'doing';
        break;
      case 'done-column':
        taskNextStatus = 'done';
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

// this._taskService.toDoTasks.subscribe((toDoTasks) => {
//   console.log('Lista atual de tarefas TOdO: ', toDoTasks);
//   this.toDoTasksDropList = toDoTasks;
// });
// this._taskService.doingTasks.subscribe((doingTasks) => {
//   console.log('Lista atual de tarefas doing: ', doingTasks);
//   this.doingTasksDropList = doingTasks;
// });
// this._taskService.doneTasks.subscribe((doneTasks) => {
//   console.log('Lista atual de tarefas done: ', doneTasks);
//   this.doneTasksDropList = doneTasks;
// });