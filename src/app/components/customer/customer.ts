import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Customer} from '../../model/customer/customer.model';

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

  onSaveCustomer(value: any) {
    console.log('submitted form value:', value);
    console.log('current customer object:', this.customer);
  }
}
