import { Injectable } from '@angular/core';
import { Training } from '../../model/training/training.model';
import { CartModel } from '../../model/cart/cart.model';
import {Customer} from '../../model/customer/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  customers: Customer[] = [];

  addCustomer(customer: Customer): void {
    this.customers.push(customer);
  }

  getCustomers(): Customer[] {
    return this.customers;
  }

  removeCustomer(id: number): void {
    this.customers = this.customers.filter(c => c.id !== id);
  }
}

