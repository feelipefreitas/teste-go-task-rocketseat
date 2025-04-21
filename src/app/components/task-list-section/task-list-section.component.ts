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

  ngOnInit() {
    this._taskService.toDoTasks.subscribe((toDoTasks) => {
      console.log('Lista atual de tarefas TOdO: ', toDoTasks);
      this.toDoTasksDropList = toDoTasks;
    });
    this._taskService.doingTasks.subscribe((doingTasks) => {
      console.log('Lista atual de tarefas doing: ', doingTasks);
      this.doingTasksDropList = doingTasks;
    });
    this._taskService.doneTasks.subscribe((doneTasks) => {
      console.log('Lista atual de tarefas done: ', doneTasks);
      this.doneTasksDropList = doneTasks;
    });
  }

  drop(event: CdkDragDrop<ITask[]>) {
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
