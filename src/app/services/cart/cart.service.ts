import { Injectable } from '@angular/core';
import { Training } from '../../model/training/training.model';
import { CartModel } from '../../model/cart/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  cart: CartModel = new CartModel();

  addTraining(training: Training): void {
    this.cart.listTrainings.push(training);
  }

  getTrainings(): Training[] {
    return this.cart.listTrainings;
  }

  removeTraining(training: Training): void {
    const idx = this.cart.listTrainings.findIndex(t => t.id === training.id);
    if (idx >= 0) this.cart.listTrainings.splice(idx, 1);
  }
}
