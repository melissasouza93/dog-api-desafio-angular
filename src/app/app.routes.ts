import { Routes } from '@angular/router';
import { DogListComponent } from './components/dog-list/dog-list.component';

export const routes: Routes = [
  { path: '', component: DogListComponent },
  { path: 'dog/:id', loadComponent: () => import('./components/dog-detail/dog-detail.component').then(m => m.DogDetailComponent) },
  { path: '**', redirectTo: '' }
];
