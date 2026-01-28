import { Training } from '../training/training.model';

export class CartModel {
  listTrainings: Training[] = [];

  constructor(initial?: Training[]) {
    if (initial?.length) this.listTrainings = [...initial];
  }

  add(training: Training): void {
    this.listTrainings.push(training);
  }

  removeAt(index: number): void {
    if (index < 0 || index >= this.listTrainings.length) return;
    this.listTrainings.splice(index, 1);
  }

  remove(training: Training): void {
    const idx = this.listTrainings.indexOf(training);
    if (idx >= 0) this.listTrainings.splice(idx, 1);
  }

  clear(): void {
    this.listTrainings = [];
  }

  get count(): number {
    return this.listTrainings.length;
  }

  get totalPrice(): number {
    return this.listTrainings.reduce((sum, t: any) => sum + (Number(t.price) || 0), 0);
  }
}
