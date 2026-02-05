// training-form.component.ts
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../services/api/api-service';
import { Training } from '../../model/training/training.model';

@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.html',
  // Formulaire template-driven (NgForm / ngModel)
  imports: [FormsModule],
})
export class TrainingFormComponent implements OnInit {

  // Modèle par défaut (création)
  defaultModel: Training = new Training('', '', 0, 0, 0);

  // Modèle lié au formulaire
  model: Training = { ...this.defaultModel };

  // Copie utilisée pour "Reset" en mode édition (revient à l'état initial chargé)
  private originalModel: Training | null = null;

  // Gestion du mode (création vs édition)
  isEditMode = false;
  trainingId: string | null = null;

  // États UI (chargement / sauvegarde / erreurs)
  loading = false;
  saving = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Récupère l'id depuis l'URL : si présent -> édition, sinon -> création
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.trainingId = String(idParam);

      // Validation simple de l'identifiant
      // (si tu utilises des ids string, cette vérification peut être inutile)
      if (Number.isNaN(this.trainingId)) {
        this.errorMessage = 'Identifiant invalide.';
        return;
      }

      // Charge la formation à éditer
      this.loadTraining(this.trainingId);
    } else {
      // Mode création : modèle vide + pas de "originalModel"
      this.isEditMode = false;
      this.model = { ...this.defaultModel };
      this.originalModel = null;
      this.loading = false;
    }
  }

  // Charge une formation et remplit le formulaire
  private loadTraining(id: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.apiService.getTrainingById(id).subscribe({
      next: (training) => {
        // Normalise les champs (évite null/undefined et force les types numériques)
        this.model = {
          id: training.id,
          name: training.name ?? '',
          description: training.description ?? '',
          price: Number(training.price ?? 0),
          stock: Number(training.stock ?? 0),
          quantity: Number(training.quantity ?? 0),
        };

        // Sauvegarde une copie pour le bouton reset en mode édition
        this.originalModel = { ...this.model };

        this.loading = false;

        // Forçage éventuel de la mise à jour de la vue (selon stratégie de détection)
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = "Impossible de charger la formation (introuvable ou erreur serveur).";
        this.loading = false;
      },
    });
  }

  // Soumission du formulaire : création ou mise à jour selon le mode
  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    this.saving = true;
    this.errorMessage = '';

    // Construit un payload "propre" (trim + conversions numériques)
    const payload: Training = {
      name: this.model.name.trim(),
      description: this.model.description.trim(),
      price: Number(this.model.price),
      stock: Number(this.model.stock),
      quantity: Number(this.model.quantity),
      // Attention : en édition, l'id devrait rester celui existant (pas un nouveau Date.now()).
      id: String(Date.now()),
    };

    if (this.isEditMode && this.trainingId !== null) {
      // Mode édition : mise à jour
      this.apiService.updateTraining(this.trainingId, payload).subscribe({
        next: (updated) => {
          // Met à jour le modèle et la copie "originale" (reset revient à la dernière version sauvegardée)
          this.model = { ...updated };
          this.originalModel = { ...this.model };
          this.saving = false;

          // Retour à la liste admin avec flash message
          this.router.navigateByUrl('/admin-trainings', {
            state: { flash: { type: 'success', text: 'Formation mise à jour avec succès.' } }
          });
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la mise à jour.';
          this.saving = false;
        },
      });

    } else {
      // Mode création : ajout
      this.apiService.addTraining(payload).subscribe({
        next: () => {
          this.saving = false;

          // Retour à la liste admin avec flash message
          this.router.navigateByUrl('/admin-trainings', {
            state: { flash: { type: 'success', text: 'Formation créée avec succès.' } }
          });
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la création.';
          this.saving = false;
        },
      });
    }
  }

  // Réinitialisation :
  // - en édition : revient à la version chargée (originalModel)
  // - en création : revient au modèle par défaut
  resetForm(form: NgForm): void {
    if (this.isEditMode && this.originalModel) {
      form.resetForm({ ...this.originalModel });
    } else {
      form.resetForm({ ...this.defaultModel });
    }
  }
}
