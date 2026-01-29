import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CartService } from '../../services/cart/cart.service';   // adjust
import { Training } from '../../model/training/training.model';      // adjust

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  constructor(public cartService: CartService) {}

  get trainings(): Training[] {
    return this.cartService.getTrainings();
  }

  removeFromCart(t: Training): void {
    this.cartService.removeTraining(t);
  }
}
