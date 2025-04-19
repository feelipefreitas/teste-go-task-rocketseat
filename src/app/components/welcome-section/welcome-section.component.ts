import { Component, inject } from '@angular/core';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';

@Component({
  selector: 'app-welcome-section',
  imports: [DialogModule],
  templateUrl: './welcome-section.component.html',
  styleUrl: './welcome-section.component.css'
})
export class WelcomeSectionComponent {
  private readonly _dialog = inject(Dialog);

  openNewTaskModal() {
    this._dialog.open(TaskFormModalComponent, {
      width: '95%',
      maxWidth: '620px',
    });
  }
}
