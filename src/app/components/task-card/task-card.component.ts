import { SlicePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ModalControllerService } from '../../services/modal-controller.service';
import { ITask, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-card',
  imports: [SlicePipe],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  @Input({ required: true }) task!: ITask;

  private readonly _modalControllerService = inject(ModalControllerService);
  private readonly _taskService = inject(TaskService);

  openTaskCommentsModal() {
    this._modalControllerService.openTaskCommentsModal();
  }

  openEditTaskModal() {
    const dialogRef = this._modalControllerService.openEditTaskModal({ name: this.task.name, description: this.task.description });

    dialogRef.closed.subscribe((taskForm) => {
      if (taskForm) {
        console.log('Editando tarefa: ', taskForm);

        this._taskService.updateTaskNameAndDescription(
          this.task.id,
          this.task.status,
          taskForm.name,
          taskForm.description,
        );
      }
    });
  }
}
