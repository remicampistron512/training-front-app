import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { Customer } from '../../model/customer/customer.model';
import {environment} from '../../Environment'

@Injectable({ providedIn: 'root' })
export class CustomerService {


  constructor(private http: HttpClient) {}

  addCustomer(customer: Customer): Observable<Customer> {
    // json-server will create id automatically if you omit it
    return this.http.post<Customer>(environment.host+"/customers", customer);
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(environment.host+"/customers");
  }

  getCustomerByUserId(userId: string | null): Observable<Customer | null> {
    return this.http
      .get<Customer[]>(`${environment.host}/customers`, { params: { userId: String(userId) } })
      .pipe(map(list => list[0] ?? null));
  }
  removeCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.host}/${id}`);
  }

  updateCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${environment.host}/${customer.id}`, customer);
  }

  patchCustomer(id: number, partial: Partial<Customer>): Observable<Customer> {
    return this.http.patch<Customer>(`${environment.host}/${id}`, partial);
  }
}
