import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TaskCommentsModalComponent } from '../task-comments-modal/task-comments-modal.component';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';

@Component({
  selector: 'app-task-card',
  imports: [SlicePipe, DialogModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  private readonly _dialog = inject(Dialog);

  openTaskCommentsModal() {
    this._dialog.open(TaskCommentsModalComponent, {
      width: '95%',
      maxWidth: '620px',
    });
  }

  openEditTaskModal() {
    this._dialog.open(TaskFormModalComponent, {
      width: '95%',
      maxWidth: '620px',
    });
  }
}
