import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {Trainings} from './components/trainings/trainings';
import {Cart} from './components/cart/cart';
import {CustomerComponent} from './components/customer/customer';
import {CustomerList} from './components/customer-list/customer-list';
import {Order} from './components/order/order';
import {NotFound} from './components/not-found/not-found';
import {LoginForm} from './components/login-form/login-form';
import {UserList} from './components/user-list/user-list';
import {UserForm} from './components/user-form/user-form';
import {Admin} from './components/admin/admin';
import {adminGuard} from './components/admin-guard'

/* Les routes sont pris en compte dans l'ordre (de haut en bas) */
export const routes: Routes = [
  { path: 'trainings', component: Trainings},
  { path: 'admin',component: Admin, canActivate : [adminGuard]
  },
  { path: 'cart',component: Cart},
  { path: 'order', component: Order},
  { path: 'customerList', component: CustomerList},
  { path: 'customer', component: CustomerComponent},
  { path: '', redirectTo: 'trainings', pathMatch: 'full' },
  { path: '404', component: NotFound },
  { path: 'login',component: LoginForm},
  { path:'userList', component: UserList},
  { path:'userForm', component: UserForm},
  { path : '**', redirectTo: "/404"},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
