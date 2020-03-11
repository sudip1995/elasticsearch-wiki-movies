import {Routes} from '@angular/router';
import {MovieDetailsComponent} from './components/movie-details/movie-details.component';
import {AppLayoutComponent} from './components/app-layout/app-layout.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: AppLayoutComponent
  },
  {
    path : ':id',
    component: MovieDetailsComponent
  },
  {
    path      : '**',
    redirectTo: '/',
    pathMatch: 'full'
  }
];
