import { Component } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {Customer} from '../../model/customer/customer.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-customer-list',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
})
export class CustomerList {
  listCustomers : Customer[] | undefined;

  ngOnInit() : void {
    this.listCustomers = [
      {id: 1, name: 'Bobby', firstName: 'Bob',address: '50 rue de bob', phone: '1234567890',email: 'customer1@example.com'},
      {id: 2, name: 'Alice', firstName: 'Alice',address: '50 rue de alice', phone: '9876543210',email: 'customer2@example.com'},
      {id: 3, name: 'Charlie', firstName: 'Charlie',address: '50 rue de charlie', phone: '5555555555',email: 'customer3@example.com'}
    ]
  }

}
