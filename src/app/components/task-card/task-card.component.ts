import { SlicePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ModalControllerService } from '../../services/modal-controller.service';

@Component({
  selector: 'app-task-card',
  imports: [SlicePipe],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  private readonly _modalControllerService = inject(ModalControllerService);

  openTaskCommentsModal() {
    this._modalControllerService.openTaskCommentsModal();
  }

  openEditTaskModal() {
    this._modalControllerService.openEditTaskModal({ name: 'Nome Edição', description: 'Descrição Edição' });
  }
}
