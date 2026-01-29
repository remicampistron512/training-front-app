import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Training } from '../../model/training/training.model';
import { CartService } from '../../services/cart/cart.service';
import { TrainingSearchService } from '../../services/search-bar/training-search.service';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './trainings.html',
  styleUrl: './trainings.css',
})
export class Trainings implements OnInit, OnDestroy {
  listTrainings: Training[] = [];
  filteredTrainings: Training[] = [];

  private sub?: Subscription;

  constructor(
    private cartService: CartService,
    private search: TrainingSearchService
  ) {}
  searchTerm = '';
  ngOnInit(): void {
    this.listTrainings = [
      { id: 1, name: 'Training 1', description: 'Description 1', price: 100, quantity: 1 },
      { id: 2, name: 'Training 2', description: 'Description 2', price: 200, quantity: 1 },
      { id: 3, name: 'Training 3', description: 'Description 3', price: 300, quantity: 1 },
    ];

    this.filteredTrainings = [...this.listTrainings];

    this.sub = this.search.term$.subscribe(term => this.applyFilter(term));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private applyFilter(term: string): void {
    this.searchTerm = term; // ✅ keep it for the template

    const q = (term ?? '').trim().toLowerCase();
    this.filteredTrainings = !q
      ? [...this.listTrainings]
      : this.listTrainings.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        String(t.id).includes(q) ||
        String(t.price).includes(q)
      );
  }


  onAddToCart(training: Training) {
    this.cartService.addTraining(training);
  }
}
