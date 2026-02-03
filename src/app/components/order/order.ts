import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { CartService } from '../../services/cart/cart.service';
import { Training } from '../../model/training/training.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order {
  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private router: Router
  ) {}

  get trainings(): Training[] {
    return this.cartService.getTrainings();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Quantité sécurisée (>=1)
  qty(t: Training): number {
    const q = Number(t.stock ?? 1);
    return Number.isFinite(q) && q > 0 ? q : 1;
  }

  lineTotal(t: Training): number {
    return Number(t.price ?? 0) * this.qty(t);
  }

  get total(): number {
    return this.trainings.reduce((sum, t) => sum + this.lineTotal(t), 0);
  }

  goBackToCart(): void {
    this.router.navigate(['/cart']);
  }

  confirmOrder(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/order' } });
      return;
    }

    if (this.trainings.length === 0) {
      return;
    }



    console.log('Commande confirmée (demo)', {
      items: this.trainings.map(t => ({
        trainingId: t.id,
        qty: this.qty(t),
        unitPrice: t.price,
        lineTotal: this.lineTotal(t),
      })),
      total: this.total,
    });

    // Optionnel: vider le panier si tu as une méthode
    // this.cartService.clear();

    this.router.navigate(['/trainings']); // ou /order-success
  }
}
