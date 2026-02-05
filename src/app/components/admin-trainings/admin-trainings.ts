import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { ApiService } from '../../services/api/api-service';
import { Training } from '../../model/training/training.model';
import { CartService } from '../../services/cart/cart.service';
import { TrainingSearchService } from '../../services/search-bar/training-search.service';
import {FlashService} from '../../services/flash/flash.service';
import {SearchBar} from '../search-bar/search-bar';

type SortKey = 'id' | 'name' | 'description' | 'price';
type SortDir = 'asc' | 'desc';


@Component({
  selector: 'app-admin-trainings',
  imports: [FormsModule, RouterLink, SearchBar],
  templateUrl: './admin-trainings.html',
  styleUrl: './admin-trainings.css',
})
export class AdminTrainings implements OnInit, OnDestroy {



  // Liste complète des formations (source de vérité côté composant)
  listTrainings: Training[] = [];

  // Liste affichée après filtres + tri
  filteredTrainings: Training[] = [];

  // Filtre texte (recherche)
  searchTerm = '';

  // Filtre prix maximum (null = pas de filtre)
  maxPrice: number | null = null;

  // Paramètres de tri (colonne + direction)
  sortKey: SortKey = 'id';
  sortDir: SortDir = 'asc';

  // Message d’erreur générique (API, etc.)
  error: string | null = null;

  // Abonnement au service de recherche (à libérer à la destruction du composant)
  private sub?: Subscription;

  constructor(
    private readonly cartService: CartService,
    private readonly search: TrainingSearchService,
    private readonly apiService: ApiService,
    private readonly cdr: ChangeDetectorRef,
    private readonly flash: FlashService
  ) {}

  ngOnInit(): void {
    // 1) Charger toutes les formations
    this.getAllTrainings();

    // 2) Réagir aux changements de terme de recherche (service partagé)
    this.sub = this.search.term$.subscribe(term => {
      this.searchTerm = term ?? '';
      this.applyFilters();
    });


  }

  ngOnDestroy(): void {
    // Nettoyage de l’abonnement RxJS
    this.sub?.unsubscribe();
  }



  // Charge les formations depuis l’API, puis applique filtres + tri
  getAllTrainings(): void {
    this.apiService.getTrainings().subscribe({
      next: (data) => {
        this.listTrainings = data ?? [];
        this.applyFilters();

        // Forçage du rafraîchissement de la vue (utile selon stratégie de détection)
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

  // Ajoute une formation au panier (logique déléguée au service panier)
  onAddToCart(training: Training): void {
    this.cartService.addTraining(training);
  }

  // Met à jour le filtre "prix max" en normalisant la valeur (null si vide/invalid)
  setMaxPrice(value: unknown): void {
    if (value === null || value === undefined || value === '') {
      this.maxPrice = null;
    } else {
      const n = typeof value === 'number' ? value : Number(value);
      this.maxPrice = Number.isFinite(n) ? n : null;
    }

    this.applyFilters();
  }

  // Applique les filtres (texte + prix max), puis déclenche le tri
  private applyFilters(): void {
    const query = (this.searchTerm ?? '').trim().toLowerCase();
    const max = this.maxPrice;

    this.filteredTrainings = this.listTrainings.filter(t => {
      // Filtre texte sur plusieurs champs
      const matchesText =
        !query ||
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        String(t.id).includes(query) ||
        String(t.price).includes(query);

      // Filtre prix (si max null ou 0, on considère qu'il n'y a pas de limite)
      const matchesMax = (max === null || max === 0) ? true : t.price <= max;

      return matchesText && matchesMax;
    });

    this.applySort();
  }

  // Modifie le tri : si on reclique sur la même colonne, on inverse la direction
  setSort(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
    this.applySort();
  }

  // Applique le tri sur la liste filtrée (prix en numérique, le reste en string)
  private applySort(): void {
    const dir = this.sortDir === 'asc' ? 1 : -1;
    const key = this.sortKey;

    this.filteredTrainings = [...this.filteredTrainings].sort((a, b) => {
      if (key === 'price') {
        return (a.price - b.price) * dir;
      }

      return (
        String((a as any)[key]).localeCompare(String((b as any)[key]), undefined, {
          sensitivity: 'base',
        }) * dir
      );
    });
  }

  // Supprime une formation côté API, puis met à jour la liste locale pour refléter l'état
  protected removeTraining(id?: string): void {
    if (!id) {
      this.flash.danger('Impossible de supprimer : id manquant');
      return;
    }

    this.apiService.removeTraining(id).subscribe({
      next: () => {
        // Mise à jour locale (optimiste) pour retirer la ligne immédiatement
        this.listTrainings = this.listTrainings.filter(t => t.id !== id);
        this.flash.success('La formation a été supprimée.');

        this.applyFilters();
      },
      error: (err) => {
        this.flash.danger(err?.message ?? 'Suppression échouée.');

      }
    });
  }
}
