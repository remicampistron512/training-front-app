import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Training } from '../../model/training/training.model';
import { CartService } from '../../services/cart/cart.service';
import { TrainingSearchService } from '../../services/search-bar/training-search.service';
import { ApiService } from '../../services/api/api-service';
import {SearchBar} from '../search-bar/search-bar';
import {FlashService} from '../../services/flash/flash.service';

type SortKey = 'id' | 'name' | 'description' | 'price';
type SortDir = 'asc' | 'desc';


@Component({
  selector: 'app-trainings',
  standalone: true,
  // Formulaire template-driven (ngModel) pour filtres / quantités
  imports: [FormsModule, SearchBar],
  templateUrl: './trainings.html',
  styleUrl: './trainings.css',
})
export class Trainings implements OnInit, OnDestroy {

  // Liste complète (source de vérité côté composant)
  listTrainings: { id: string; name: string; description: string; price: number; stock: number; quantity: number }[] = [];

  // Liste affichée après filtres + tri
  filteredTrainings: { id: string; name: string; description: string; price: number; stock: number; quantity: number }[] = [];

  // Terme de recherche (vient du service partagé)
  searchTerm = '';

  // Filtre prix maximum (null = pas de filtre)
  maxPrice: number | null = null;

  // Paramètres de tri (colonne + direction)
  sortKey: SortKey = 'id';
  sortDir: SortDir = 'asc';

  // Erreur API éventuelle
  error: string | null = null;



  // Abonnement au flux de recherche (à libérer)
  private sub?: Subscription;


  constructor(
    private cartService: CartService,
    private search: TrainingSearchService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private flash: FlashService
  ) {}

  ngOnInit(): void {
    // 1) Charger les données depuis l'API
    this.getAllTrainings();

    // 2) Réagir aux changements de terme de recherche
    this.sub = this.search.term$.subscribe(term => {
      this.searchTerm = term ?? '';
      this.applyFilters();
    });


  }

  ngOnDestroy(): void {
    // Nettoyage RxJS
    this.sub?.unsubscribe();
  }



  // Récupère les formations depuis l'API, normalise quelques champs, puis filtre/tri
  getAllTrainings(): void {
    this.apiService.getTrainings().subscribe({
      next: (data) => {
        // Normalisation de types (id en string + prix en number)
        this.listTrainings = (data ?? []).map(t => ({
          ...t,
          id: String(t.id),
          price: Number(t.price),
        }));

        // Applique filtres + tri
        this.applyFilters();

        // Forçage éventuel du rafraîchissement (selon stratégie de détection)
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.message ?? 'Erreur API';
        this.listTrainings = [];
        this.filteredTrainings = [];
        this.cdr.detectChanges();
      }
    });
  }

  // Ajoute une formation au panier (logique portée par CartService)
  onAddToCart(training: Training): void {
    this.flash.success('Formation ajoutée au panier.');
    this.cartService.addTraining(training);
  }

  // Met à jour le filtre "prix max" en gérant null/valeurs invalides
  setMaxPrice(value: unknown): void {
    if (value === null || value === undefined || value === '') {
      this.maxPrice = null;
    } else {
      const n = typeof value === 'number' ? value : Number(value);
      this.maxPrice = Number.isFinite(n) ? n : null;
    }

    this.applyFilters();
  }

  // Filtre selon texte + prix max, puis applique le tri
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

  // Change la colonne de tri ; si on reclique sur la même colonne, inverse asc/desc
  setSort(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
    this.applySort();
  }

  // Applique le tri à la liste filtrée
  private applySort(): void {
    const dir = this.sortDir === 'asc' ? 1 : -1;
    const key = this.sortKey;

    this.filteredTrainings = [...this.filteredTrainings].sort((a, b) => {
      // Tri numérique pour le prix
      if (key === 'price') {
        return (a.price - b.price) * dir;
      }

      // Tri alphabétique pour le reste
      return (
        String((a as any)[key]).localeCompare(String((b as any)[key]), undefined, {
          sensitivity: 'base',
        }) * dir
      );
    });
  }
}
