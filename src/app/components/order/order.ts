import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../services/cart/cart.service';
import { Training } from '../../model/training/training.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-order',
  standalone: true,
  // Directives Angular de base + liens de navigation
  imports: [CommonModule, RouterLink],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order {

  // Services :
  // - CartService : accès au contenu du panier
  // - AuthService : vérifie si l’utilisateur est connecté
  // - Router : navigation (retour panier, login, finalisation)
  constructor(
    public cartService: CartService,
    public authService: AuthService,
    protected router: Router
  ) {}

  // Expose les formations du panier au template
  get trainings(): Training[] {
    return this.cartService.getTrainings();
  }

  // Indique si l’utilisateur est authentifié (utile pour afficher/autoriser la confirmation)
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Normalise la quantité d'une ligne (minimum 1, évite NaN/0/valeurs négatives)
  qty(t: Training): number {
    const q = Number(t.quantity ?? 1);
    return Number.isFinite(q) && q > 0 ? q : 1;
  }

  // Calcule le total d’une ligne (prix unitaire * quantité)
  lineTotal(t: Training): number {
    return Number(t.price ?? 0) * this.qty(t);
  }

  // Calcule le total global de la commande (somme des lignes)
  get total(): number {
    return this.trainings.reduce((sum, t) => sum + this.lineTotal(t), 0);
  }

  // Retour à la page panier
  goBackToCart(): void {
    this.router.navigate(['/cart']);
  }

  // Validation de la commande :
  // - redirection login si non connecté
  // - ignore si panier vide
  // - puis navigation vers la page de finalisation
  confirmOrder(): void {
    if (!this.isLoggedIn) {
      // returnUrl permet de revenir sur /order après login
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/order' } });
      return;
    }

    if (this.trainings.length === 0) {
      // Rien à confirmer si le panier est vide
      return;
    }

    // Démo : log d’un récap (à remplacer par un appel API "createOrder")
    console.log('Commande confirmée (demo)', {
      items: this.trainings.map(t => ({
        trainingId: t.id,
        qty: this.qty(t),
        unitPrice: t.price,
        lineTotal: this.lineTotal(t),
      })),
      total: this.total,
    });

    // Étape suivante : informations client / finalisation
    this.router.navigate(['/finalizeOrder']); // ou /order-success
  }
}
