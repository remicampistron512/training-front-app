import { Injectable } from '@angular/core';
import { Training } from '../../model/training/training.model';

type CartState = {
  trainings: Training[];
};

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'cart_v1';

  private state: CartState = this.load();

  // --- Public API ---
  addTraining(training: Training): void {
    // avoid duplicates (optional)
    const exists = this.state.trainings.some(t => t.id === training.id);
    if (!exists) {
      this.state.trainings.push(training);
      this.save();
    }
  }

  getTrainings(): Training[] {
    // return a copy to avoid accidental external mutation
    return [...this.state.trainings];
  }

  removeTrainingById(id: string): void {
    const before = this.state.trainings.length;
    this.state.trainings = this.state.trainings.filter(t => t.id !== id);
    if (this.state.trainings.length !== before) this.save();
  }

  removeTraining(training: Training): void {
    // works for both string/number ids if your model is consistent
    this.removeTrainingById(String(training.id));
  }

  clear(): void {
    console.log("clear");
    this.state.trainings = [];
    this.save();
  }

  // --- Persistence helpers ---
  private load(): CartState {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return { trainings: [] };

      const parsed = JSON.parse(raw) as Partial<CartState>;
      return { trainings: Array.isArray(parsed.trainings) ? parsed.trainings : [] };
    } catch {
      return { trainings: [] };
    }
  }

  private save(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  }
}
