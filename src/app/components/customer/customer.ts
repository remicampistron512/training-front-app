import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Customer} from '../../model/customer/customer.model';
import {Router} from '@angular/router';
import {CustomerService} from '../../services/customer/customer.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customer.html',
  styleUrls: ['./customer.css'],
})
export class CustomerComponent {
  customer: Customer = {
    id:0,
    name: '',
    firstName: '',
    address: '',
    phone: '',
    email: '',
  };

  constructor(private customerService: CustomerService, private router: Router) { }


  onSaveCustomer() {
    this.customerService.addCustomer(this.customer);
    this.router.navigate(['/customerList']); // navigate AFTER save/log

  }

}
