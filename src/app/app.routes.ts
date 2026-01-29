import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {Trainings} from './components/trainings/trainings';
import {Cart} from './components/cart/cart';
import {CustomerComponent} from './components/customer/customer';
import {CustomerList} from './components/customer-list/customer-list';
import {Order} from './components/order/order';
import {NotFound} from './components/not-found/not-found';

export const routes: Routes = [
  { path: 'trainings', component: Trainings},
  { path: 'cart',component: Cart},
  { path: 'order', component: Order},
  { path: 'customerList', component: CustomerList},
  { path: 'customer', component: CustomerComponent},
  { path: '', redirectTo: 'trainings', pathMatch: 'full' },
  { path: '404', component: NotFound },
  {path : '**', redirectTo: "/404"},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
