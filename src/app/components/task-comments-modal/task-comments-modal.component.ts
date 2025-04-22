import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { ITask } from '../../services/task.service';

@Component({
  selector: 'app-task-comments-modal',
  imports: [],
  templateUrl: './task-comments-modal.component.html',
  styleUrl: './task-comments-modal.component.css'
})
export class TaskCommentsModalComponent {
  readonly task: ITask = inject(DIALOG_DATA);
}
