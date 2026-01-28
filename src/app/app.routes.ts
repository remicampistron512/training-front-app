import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {Trainings} from './components/trainings/trainings';

export const routes: Routes = [
  {
    path: 'trainings',
    component: Trainings
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
