import { Training } from '../training/training.model';

export class CartModel {
  listTrainings: Training[] = [];

  constructor(initial?: Training[]) {
    if (initial?.length) this.listTrainings = [...initial];
  }


}
