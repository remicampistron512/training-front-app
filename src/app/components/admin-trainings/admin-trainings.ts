import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { ApiService } from '../../services/api/api-service';
import { Training } from '../../model/training/training.model';
import { CartService } from '../../services/cart/cart.service';
import { TrainingSearchService } from '../../services/search-bar/training-search.service';

type SortKey = 'id' | 'name' | 'description' | 'price';
type SortDir = 'asc' | 'desc';
type Flash = { type: 'success' | 'danger' | 'info' | 'warning'; text: string };

@Component({
  selector: 'app-admin-trainings',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-trainings.html',
  styleUrl: './admin-trainings.css',
})
export class AdminTrainings implements OnInit, OnDestroy {

  // Message flash (succès/erreur/info) affiché en haut de page
  flash: Flash | null = null;

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
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // 1) Charger toutes les formations
    this.getAllTrainings();

    // 2) Réagir aux changements de terme de recherche (service partagé)
    this.sub = this.search.term$.subscribe(term => {
      this.searchTerm = term ?? '';
      this.applyFilters();
    });

    // 3) Récupérer un flash éventuellement passé via navigation (history.state)
    const flash = (history.state as any)?.flash as Flash | undefined;
    if (flash?.text) {
      this.flash = flash;

      // Auto-masquage après 3 secondes
      setTimeout(() => (this.flash = null), 3000);

      // Nettoie le state pour éviter que le flash réapparaisse (back/forward)
      history.replaceState({ ...history.state, flash: null }, '');
    }
  }

  ngOnDestroy(): void {
    // Nettoyage de l’abonnement RxJS
    this.sub?.unsubscribe();
  }

  // Ferme le message flash via le bouton "close"
  closeFlash(): void {
    this.flash = null;
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
      this.flash = { type: 'danger', text: 'Impossible de supprimer : id manquant.' };
      return;
    }

    this.apiService.removeTraining(id).subscribe({
      next: () => {
        // Mise à jour locale (optimiste) pour retirer la ligne immédiatement
        this.listTrainings = this.listTrainings.filter(t => t.id !== id);

        this.flash = { type: 'success', text: 'La formation a été supprimée.' };
        this.applyFilters();
      },
      error: () => {
        this.flash = { type: 'danger', text: 'Suppression échouée.' };
      }
    });
  }
}
