import {Component, inject, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Customer } from '../../model/customer/customer.model';
import { CustomerService } from '../../services/customer/customer.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-customer-list',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
})
export class CustomerList {

  error: string | null = null;
  private readonly customerService = inject(CustomerService)
  //constructor(private readonly customerService: CustomerService) {}
  listCustomers = this.customerService.getCustomers();


}
