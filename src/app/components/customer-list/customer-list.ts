import { Component } from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {Customer} from '../../model/customer/customer.model';
import {RouterLink} from '@angular/router';
import {Router} from '@angular/router';
import {CustomerService} from '../../services/customer/customer.service';

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
  constructor(private customerService: CustomerService) { }

  ngOnInit() : void {
    this.listCustomers = this.customerService.getCustomers();
  }


}
