import { Injectable } from '@angular/core';
import { Training } from '../../model/training/training.model';
import { CartModel } from '../../model/cart/cart.model';

@Injectable({ providedIn: 'root' })
export class trainingsService {
  trainings = new CartModel();
  listTrainings = [];



  getTrainings(): Training[] {
    return this.listTrainings;
  }


}
