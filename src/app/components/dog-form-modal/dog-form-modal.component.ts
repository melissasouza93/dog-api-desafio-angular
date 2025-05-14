import { Component, EventEmitter, inject, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Dog } from '../../models/dog.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DogService } from '../../services/dog.service';

@Component({
  selector: 'app-dog-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './dog-form-modal.component.html'
})
export class DogFormModalComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  private destroy$ = new Subject<void>();
  imagePreview: string | import('@angular/platform-browser').SafeUrl | null = null;
  selectedImageFile: File | null = null;
  dogService = inject(DogService);

  constructor(
    public dialogRef: MatDialogRef<DogFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dog: Dog },
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initializeForm();
    if (this.data.dog?.reference_image_id) {
      this.imagePreview = this.dogService.getDogImage(this.data.dog.reference_image_id);
    }
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result as string;
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

  initializeForm() {
    this.form = this.fb.group({
      name: [this.data.dog?.name || '', /* validators */],
      temperament: [this.data.dog?.temperament || ''],
      life_span: [this.data.dog?.life_span || ''],
      origin: [this.data.dog?.origin || ''],
      weight: [this.data.dog?.weight?.metric || ''],
      height: [this.data.dog?.height?.metric || '']
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const updatedDog: Dog = {
        ...this.data.dog,
        ...this.form.value,
        weight: { metric: this.form.value.weight },
        height: { metric: this.form.value.height },

        reference_image_id: this.selectedImageFile ? this.imagePreview : this.data.dog.reference_image_id
      };
      this.dialogRef.close(updatedDog);
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
