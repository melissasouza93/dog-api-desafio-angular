import { Component, inject, OnDestroy } from '@angular/core';
import { DogService } from '../../services/dog.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DogCardComponent } from '../shared/dog-card/dog-card.component';
import { Dog } from '../../models/dog.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DogFormModalComponent } from '../dog-form-modal/dog-form-modal.component';

@Component({
  selector: 'app-dog-list',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    DogCardComponent
  ],
  templateUrl: './dog-list.component.html',
  styleUrls: ['./dog-list.component.scss']
})
export class DogListComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  dogService = inject(DogService);
  router = inject(Router);
  dialog = inject(MatDialog);

  searchControl = this.dogService.searchControl;
  totalItems = this.dogService.totalItems;
  currentPage = this.dogService.currentPage;
  itemsPerPage = this.dogService.itemsPerPage;
  loading = this.dogService.loading;

  showForm = false;

  onCreateDog(newDog: Dog) {
    const dogs = this.dogService.getDogsLocal();
    const fakeId = (Math.max(...dogs.map(d => +d.id || 0), 0) + 1).toString();
    const dogToAdd = { ...newDog, id: fakeId };
    this.dogService.addDog(dogToAdd);
    this.showForm = false;
  }

  get error() {
    return this.dogService.error();
  }

  isHomePage(): boolean {
    return this.router.url === '/';
  }

  onPageChange(event: PageEvent) {
    this.dogService.changePage(event.pageIndex);
  }

  resetSearch() {
    this.dogService.searchControl.reset();
    this.dogService.loadDogsLocal();
  }

  getDisplayRange(): string {
    const start = this.currentPage() * this.itemsPerPage + 1;
    const end = Math.min(
      (this.currentPage() + 1) * this.itemsPerPage,
      this.totalItems()
    );
    return `${start} – ${end}`;
  }

  openDogFormModal(dog?: Dog) {
    const dialogRef = this.dialog.open(DogFormModalComponent, {
      width: '600px',
      data: { dog: dog || {} as Dog },
      disableClose: true
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (result) {
        this.onCreateDog(result);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
