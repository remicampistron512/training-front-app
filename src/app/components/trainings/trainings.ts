import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Training } from '../../model/training/training.model';
import { CartService } from '../../services/cart/cart.service';
import { TrainingSearchService } from '../../services/search-bar/training-search.service';

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
  listTrainings: Training[] = [];
  filteredTrainings: Training[] = [];

  searchTerm = '';

  maxPrice: number | null = null; // null = no max filter

  sortKey: SortKey = 'id';
  sortDir: SortDir = 'asc';

  private sub?: Subscription;

  constructor(
    private cartService: CartService,
    private search: TrainingSearchService
  ) {}

  ngOnInit(): void {
    this.listTrainings = [
      { id: 1, name: 'Angular (Fundamentals)', description: 'Components, templates, directives, services, routing, forms. Build a complete SPA.', price: 790, quantity: 1 },
      { id: 2, name: 'TypeScript for JavaScript Developers', description: 'Types, interfaces, generics, union types, type narrowing, async patterns, best practices.', price: 490, quantity: 1 },
      { id: 3, name: 'Spring Boot (REST API)', description: 'REST, validation, JPA/Hibernate, DTO mapping, error handling, pagination, testing.', price: 990, quantity: 1 },
      { id: 4, name: 'Docker & Containers (Hands-on)', description: 'Images, Dockerfile, Compose, volumes, networks, debugging, basic CI workflow.', price: 650, quantity: 1 },
      { id: 5, name: 'SQL & Relational Databases', description: 'Modeling, joins, indexes, transactions, normalization, performance basics (MySQL/MariaDB).', price: 540, quantity: 1 },
      { id: 6, name: 'Node.js + Express (Backend Essentials)', description: 'REST APIs, middleware, auth basics, validation, error handling, testing and tooling.', price: 720, quantity: 1 },
      { id: 7, name: 'Git & GitHub Workflow', description: 'Branching strategy, pull requests, code reviews, rebase vs merge, resolving conflicts.', price: 290, quantity: 1 },
      { id: 8, name: 'Clean Architecture & SOLID (Java)', description: 'Layered architecture, dependency inversion, DTO/DAO patterns, unit testing, refactoring.', price: 850, quantity: 1 },
      { id: 9, name: 'Web Security Basics (OWASP)', description: 'XSS, CSRF, SQLi, auth/session, password hashing, common mitigations and secure defaults.', price: 680, quantity: 1 },
      { id: 10, name: 'Agile Project Delivery (Scrum)', description: 'Roles, ceremonies, backlog management, estimation, sprint planning, definition of done.', price: 420, quantity: 1 },
    ];

    this.filteredTrainings = [...this.listTrainings];
    this.applySort();

    this.sub = this.search.term$.subscribe(term => {
      this.searchTerm = term ?? '';
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
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


  // ✅ single place that applies BOTH filters (text + max price)
  private applyFilters(): void {
    const q = (this.searchTerm ?? '').trim().toLowerCase();
    const max = this.maxPrice;

    this.filteredTrainings = this.listTrainings.filter(t => {
      const matchesText =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        String(t.id).includes(q) ||
        String(t.price).includes(q);

      const matchesMax = max === null ? true : t.price <= max;

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
      if (key === 'id' || key === 'price') return (a[key] - b[key]) * dir;
      return a[key].localeCompare(b[key], undefined, { sensitivity: 'base' }) * dir;
    });
  }
}
