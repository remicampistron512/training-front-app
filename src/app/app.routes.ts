import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {Trainings} from './components/trainings/trainings';
import {Cart} from './components/cart/cart';

export const routes: Routes = [
  { path: 'trainings', component: Trainings},
  { path: 'cart',component: Cart}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
