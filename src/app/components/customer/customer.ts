import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CustomerService } from '../../services/customer/customer.service';
import { Customer } from '../../model/customer/customer.model';
import {CartService} from '../../services/cart/cart.service';

type StoredUser = { id: string; email: string; login?: string };


@Component({
  selector: 'app-customer',
  standalone: true,
  // Formulaire template-driven (ngModel, ngForm)
  imports: [FormsModule],
  templateUrl: './customer.html',
  styleUrls: ['./customer.css'],
})
export class CustomerComponent implements OnInit {



  // Identifiant de l'utilisateur connecté (récupéré depuis localStorage)
  userId: string | null = null;

  // Modèle lié au formulaire (pré-rempli si un client existe déjà pour cet utilisateur)
  customer: Customer = this.createEmptyCustomer(null);

  constructor(
    private readonly customerService: CustomerService,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // 1) Récupérer l'utilisateur connecté depuis localStorage
    const raw = localStorage.getItem('user');
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const user: StoredUser | null = Array.isArray(parsed) ? parsed[0] : parsed;

    this.userId = user?.id ?? null;

    // Si aucun userId -> on ne peut pas associer le client à un utilisateur
    if (!this.userId) {
      console.error('No userId in localStorage');
      return;
    }

    // 2) Initialiser un client “vide” associé à l’utilisateur
    this.customer = this.createEmptyCustomer(this.userId);

    // 3) Pré-remplir le formulaire si un client existe déjà pour cet utilisateur
    this.customerService.getCustomerByUserId(this.userId).subscribe({
      next: (existing) => {
        if (existing) {
          // Remplace le modèle par les données existantes -> le formulaire se remplit
          this.customer = existing;

          // Sécurité : s'assurer que userId est bien présent dans l'objet customer
          if (this.userId != null) {
            this.customer.userId = this.userId;
          }

          // Dans certains contextes (OnPush / timing), on force la mise à jour de la vue
          this.cdr.markForCheck(); // ou this.cdr.detectChanges()
        }
      },
      error: (err) => console.error('Lookup failed:', err),
    });
  }

  // Fabrique un objet Customer vide (valeurs par défaut)
  private createEmptyCustomer(userId: string | null): Customer {
    return {
      id: String(Date.now()),
      name: '',
      firstName: '',
      address: '',
      phone: '',
      email: '',
      userId: userId as any, // idéalement : userId: string | null dans le model
    };
  }

  // Permet d'adapter le comportement du bouton/submit selon l'URL courante
  get isFinalizeOrderPage(): boolean {
    return this.router.url.includes('/finalizeOrder');
  }

  // Point d'entrée unique du formulaire : "enregistrer" ou "finaliser"
  onSubmit(): void {
    if (this.isFinalizeOrderPage) this.onSaveCustomerAndFinalize();
    else this.onSaveCustomer();
  }

  // Enregistre le client puis redirige vers la liste
  onSaveCustomer(): void {
    this.customerService.addCustomer(this.customer).subscribe({
      next: () => this.router.navigateByUrl('/customerList'),
      error: (err) => console.error('Add failed:', err),
    });
  }

  // Finalise la commande : si le client existe déjà -> on navigue directement,
  // sinon on crée le client puis on navigue avec un flash message.
  onSaveCustomerAndFinalize(): void {
    if (!this.userId) return;

    this.customerService.getCustomerByUserId(this.userId).subscribe({
      next: (existing) => {
        this.cartService.clear();
        // Client déjà existant : pas besoin de le recréer
        if (existing) {
          this.router.navigateByUrl('/trainings', {
            state: { flash: { type: 'success', text: 'Votre commande a bien été enregistrée.' } },
          });
          return;
        }

        // Sinon : création du client puis navigation
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
