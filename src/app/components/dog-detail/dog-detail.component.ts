import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DogService } from '../../services/dog.service';
import { Dog } from '../../models/dog.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { take } from 'rxjs';
import { DogFormModalComponent } from '../dog-form-modal/dog-form-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dog-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dog-detail.component.html',
  styleUrls: ['./dog-detail.component.scss']
})
export class DogDetailComponent implements OnInit {
  dialog = inject(MatDialog);
  constructor(
    private dogService: DogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  dog: Dog | undefined;
  loading = true;
  error: string | null = null;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDogDetails(id);
    }
  }

  goBack() {
    this.dogService.init();
    this.router.navigate(['/']);
  }

  loadDogDetails(id: string) {
    this.loading = true;
    this.dog = this.dogService.getDogById(id);
    this.loading = false;
  }

  getImageUrl() {
    if (!this.dog?.reference_image_id) return null;
    return this.dogService.getDogImage(this.dog.reference_image_id);
  }

  editDog() {
    if (!this.dog) return;
    const dialogRef = this.dialog.open(DogFormModalComponent, {
      width: '600px',
      data: { dog: this.dog },
      disableClose: true
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.dog = result;
        this.dogService.updateDog(result);
      }
    });
  }

  deleteDog() {
    if (!this.dog) return;
    if (confirm('Tem certeza que deseja excluir este cachorro?')) {
      this.dogService.deleteDog(this.dog.id);
      this.router.navigate(['/']);
    }
  }
}
