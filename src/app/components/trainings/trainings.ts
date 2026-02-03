import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Training } from '../../model/training/training.model';
import { CartService } from '../../services/cart/cart.service';
import { TrainingSearchService } from '../../services/search-bar/training-search.service';
import {ApiService} from '../../services/api/api-service';

type SortKey = 'id' | 'name' | 'description' | 'price';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './trainings.html',
  styleUrl: './trainings.css',
})
export class Trainings implements OnInit, OnDestroy {
  listTrainings: { id: string; name: string; description: string; price: number; stock: number,quantity:number }[] = [];
  filteredTrainings: {id: string; name: string; description: string; price: number; stock: number,quantity:number }[] = [];

  searchTerm = '';

  maxPrice: number | null = null; // null = no max filter

  sortKey: SortKey = 'id';
  sortDir: SortDir = 'asc';

  error: string | null = null;
  private sub?: Subscription;

  constructor(
    private cartService: CartService,
    private search: TrainingSearchService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {


  }

  ngOnInit(): void {

    // 1) Load data
    this.getAllTrainings();

    // 2) React to search term changes
    this.sub = this.search.term$.subscribe(term => {
      this.searchTerm = term ?? '';
      this.applyFilters();
    });


  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
  getAllTrainings(): void {
    this.apiService.getTrainings().subscribe({
      next: (data) => {
        this.listTrainings = (data ?? []).map(t => ({
          ...t,
          id: String(t.id),
          price: Number(t.price),
        }));
        this.applyFilters();
        this.cdr.detectChanges(); // ✅ force view update
      },
      error: (err) => {
        this.error = err?.message ?? 'Erreur API';
        this.listTrainings = [];
        this.filteredTrainings = [];
        this.cdr.detectChanges();
      }
    });
  }
  onAddToCart(training: Training): void {
    this.cartService.addTraining(training);
  }



  setMaxPrice(value: unknown): void {
    // ngModelChange from <input type="number"> can be number | null | '' (string)
    if (value === null || value === undefined || value === '') {
      this.maxPrice = null;
    } else {
      const n = typeof value === 'number' ? value : Number(value);
      this.maxPrice = Number.isFinite(n) ? n : null;
    }

    this.applyFilters();
  }


  private applyFilters(): void {
    const query = (this.searchTerm ?? '').trim().toLowerCase();
    const max = this.maxPrice;

    this.filteredTrainings = this.listTrainings.filter(t => {
      const matchesText =
        !query ||
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        String(t.id).includes(query) ||
        String(t.price).includes(query);

      const matchesMax = (max === null || max === 0) ? true : t.price <= max;

      return matchesText && matchesMax;
    });

    this.applySort();
  }

  setSort(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
    this.applySort();
  }

  private applySort(): void {
    const dir = this.sortDir === 'asc' ? 1 : -1;
    const key = this.sortKey;

    this.filteredTrainings = [...this.filteredTrainings].sort((a, b) => {
      // numeric subtraction ONLY for numeric fields
      if (key === 'price') {
        return (a.price - b.price) * dir;
      }

      // everything else (including id) as string compare
      return String((a as any)[key]).localeCompare(String((b as any)[key]), undefined, {
        sensitivity: 'base',
      }) * dir;
    });
  }




}
