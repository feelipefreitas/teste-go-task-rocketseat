import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ITask, ITaskComment } from '../../services/task.service';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { generateUniqueIdWithTimestamp } from '../../utils/generate-unique-id-with-timestamp';

@Component({
  selector: 'app-task-comments-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-comments-modal.component.html',
  styleUrl: './task-comments-modal.component.css'
})
export class TaskCommentsModalComponent {
  taskCommentsChanged = false;
  commentControl = new FormControl('', [Validators.required]);

  @ViewChild('commentInput') commentInputRef!: ElementRef<HTMLInputElement>;

  readonly _dialogRef: DialogRef<boolean> = inject(DialogRef);
  readonly task: ITask = inject(DIALOG_DATA);

  onAddComment() {
    const newComment: ITaskComment = {
      id: generateUniqueIdWithTimestamp(),
      description: this.commentControl.value ? this.commentControl.value : '',
    };

    this.task.comments.unshift(newComment);

    this.commentControl.reset();

    this.taskCommentsChanged = true;

    this.commentInputRef.nativeElement.focus();
  }

  onRemoveComment(commentId: string) {
    this.task.comments = this.task.comments.filter(comment => comment.id !== commentId);

    this.taskCommentsChanged = true;
  }

  onCloseModal() {
    this._dialogRef.close(this.taskCommentsChanged);
  }
}
