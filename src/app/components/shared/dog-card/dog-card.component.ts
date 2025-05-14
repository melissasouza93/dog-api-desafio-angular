import { Component, Input, inject } from '@angular/core';
import { Dog } from '../../../models/dog.model';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardImage, MatCardContent } from '@angular/material/card';
import { RouterLink, RouterModule } from '@angular/router';
import { DogService } from '../../../services/dog.service';

@Component({
  selector: 'app-dog-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardImage,
    MatCardContent,
    RouterLink,
    RouterModule
  ],
  templateUrl: './dog-card.component.html',
  styleUrls: ['./dog-card.component.scss']
})
export class DogCardComponent {
  @Input() dog!: Dog;
  private dogService = inject(DogService);

  get imageUrl() {
    return this.dogService.getDogImage(this.dog?.reference_image_id || '');
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/dog-placeholder.jpg';
    imgElement.alt = this.dog.name + ' (imagem não disponível)';
  }
}
