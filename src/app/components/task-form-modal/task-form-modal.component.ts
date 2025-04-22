import { Component, inject, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface ITaskFormModalData {
  mode: 'create' | 'edit';
  formValues: ITaskFormControls;
}

export interface ITaskFormControls {
  name: string;
  description: string;
}

@Component({
  selector: 'app-task-form-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form-modal.component.html',
  styleUrl: './task-form-modal.component.css'
})
export class TaskFormModalComponent {
  readonly _dialogRef: DialogRef<ITaskFormControls> = inject(DialogRef);
  readonly data: ITaskFormModalData = inject(DIALOG_DATA);

  taskForm: FormGroup = new FormGroup({
    name: new FormControl(this.data.formValues.name, [Validators.required, Validators.minLength(10)]),
    description: new FormControl(this.data.formValues.description, [Validators.required, Validators.minLength(10)]),
  });

  onFormSubmit() {
    console.log('Formulário: ', this.taskForm);
    console.log('Formulário enviado: ', this.taskForm.value);

    this.closeModal(this.taskForm.value);
  }

  closeModal(formValues: ITaskFormControls | undefined = undefined) {
    this._dialogRef.close(formValues);
  }
}
