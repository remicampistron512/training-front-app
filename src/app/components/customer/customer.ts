import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer/customer.service';
import { Customer } from '../../model/customer/customer.model';
import { ChangeDetectorRef } from '@angular/core';

type StoredUser = { id: string; email: string; login?: string };
type Flash = { type: 'success' | 'danger' | 'info' | 'warning'; text: string };

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customer.html',
  styleUrls: ['./customer.css'],
})
export class CustomerComponent implements OnInit {
  flash: Flash | null = null;

  userId: string | null = null;

  customer: Customer = this.createEmptyCustomer(null);

  constructor(
    private readonly customerService: CustomerService,
    protected router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('user');
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const user: StoredUser | null = Array.isArray(parsed) ? parsed[0] : parsed;

    this.userId = user?.id ?? null;

    if (!this.userId) {
      console.error('No userId in localStorage');
      return;
    }

    // Initialize payload with userId
    this.customer = this.createEmptyCustomer(this.userId);

    // Prefill the form if a customer already exists for this user
    this.customerService.getCustomerByUserId(this.userId).subscribe({
      next: (existing) => {
        if (existing) {
          this.customer = existing;
          this.cdr.markForCheck(); // or detectChanges()
          if (this.userId != null) {
            this.customer.userId = this.userId;
          } // safety: ensure it's set
        }
      },
      error: (err) => console.error('Lookup failed:', err),
    });
  }

  private createEmptyCustomer(userId: string | null): Customer {
    return {
      id: String(Date.now()),
      name: '',
      firstName: '',
      address: '',
      phone: '',
      email: '',
      userId: userId as any, // ideally your model: userId: string | null
    };
  }

  get isFinalizeOrderPage(): boolean {
    return this.router.url.includes('/finalizeOrder');
  }

  onSubmit(): void {
    if (this.isFinalizeOrderPage) this.onSaveCustomerAndFinalize();
    else this.onSaveCustomer();
  }

  onSaveCustomer(): void {
    // must subscribe or nothing happens
    this.customerService.addCustomer(this.customer).subscribe({
      next: () => this.router.navigateByUrl('/customerList'),
      error: (err) => console.error('Add failed:', err),
    });
  }

  onSaveCustomerAndFinalize(): void {
    if (!this.userId) return;

    this.customerService.getCustomerByUserId(this.userId).subscribe({
      next: (existing) => {
        if (existing) {
          this.router.navigateByUrl('/trainings', {
            state: { flash: { type: 'success', text: 'Votre commande a bien été enregistrée.' } },
          });
          return;
        }

        this.customerService.addCustomer(this.customer).subscribe({
          next: () => {
            this.router.navigateByUrl('/trainings', {
              state: { flash: { type: 'success', text: 'Votre commande a bien été enregistrée.' } },
            });
          },
          error: (err) => console.error('Add failed:', err),
        });
      },
      error: (err) => console.error('Lookup failed:', err),
    });
  }
}
