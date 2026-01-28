import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {Trainings} from './components/trainings/trainings';
import {Cart} from './components/cart/cart';
import {CustomerComponent} from './components/customer/customer';
import {CustomerList} from './components/customer-list/customer-list';

export const routes: Routes = [
  { path: 'trainings', component: Trainings},
  { path: 'cart',component: Cart},
  { path: 'customerList', component: CustomerList},
  { path: 'customer', component: CustomerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
