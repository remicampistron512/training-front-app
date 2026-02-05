import { Component } from '@angular/core';
import {CustomerComponent} from '../customer/customer';
import {Order} from '../order/order';

@Component({
  selector: 'app-finalize-order',
  imports: [
    CustomerComponent,
    Order
  ],
  templateUrl: './finalize-order.html',
  styleUrl: './finalize-order.css',
})
export class FinalizeOrder {

}
