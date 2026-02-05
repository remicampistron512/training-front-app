import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CartService } from '../../services/cart/cart.service';
import { Training } from '../../model/training/training.model';
import { AuthService } from '../../services/auth/auth.service';
import {FlashService} from '../../services/flash/flash.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  // Injection des services :
  // - CartService : gestion du panier (ajout/suppression/lecture)
  // - AuthService : savoir si l’utilisateur est connecté (pour afficher certaines actions)

  constructor(
    public cartService: CartService,
    public authService: AuthService,
    private flash: FlashService
  ) {}

  // Indique au template si l’utilisateur est connecté
  // (permet par exemple d’afficher un bouton "Finaliser" uniquement si loggé)
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Expose la liste des formations dans le panier au template
  // On délègue la source de vérité au CartService
  get trainings(): Training[] {
    return this.cartService.getTrainings();
  }

  // Retire une formation du panier (logique réelle gérée par le service)
  removeFromCart(t: Training): void {
    this.flash.success('La formation a été supprimée.');
    this.cartService.removeTraining(t);
  }
}
