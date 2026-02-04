// training-form.component.ts
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api/api-service';
import { Training } from '../../model/training/training.model';



@Component({
  selector: 'app-training-form',
  templateUrl: './training-form.html',
  imports: [
    FormsModule
  ],
})
export class TrainingFormComponent implements OnInit {

  defaultModel:Training = new Training('', '', 0, 0,0);
  model: Training = { ...this.defaultModel };

  // Used to revert on reset in Edit mode
  private originalModel: Training | null = null;

  isEditMode = false;
  trainingId: string | null = null;

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
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {

      this.isEditMode = true;
      this.trainingId = String(idParam);

      if (Number.isNaN(this.trainingId)) {
        this.errorMessage = "Identifiant invalide.";
        return;
      }

      this.loadTraining(this.trainingId);
    } else {
      // Create mode
      this.isEditMode = false;
      this.model = { ...this.defaultModel };
      this.originalModel = null;
      this.loading = false;
    }
  }

  private loadTraining(id: string): void {
    console.log(id);
    this.loading = true;
    this.errorMessage = '';

    this.apiService.getTrainingById(id).subscribe({
      next: (training) => {
        // Fill form
        this.model = {
          id: training.id,
          name: training.name ?? '',
          description: training.description ?? '',
          price: Number(training.price ?? 0),
          stock: Number(training.stock ?? 0),
          quantity: Number(training.quantity ?? 0),
        };
        console.log(this.model);
        // Keep a copy for reset in edit mode
        this.originalModel = { ...this.model };

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = "Impossible de charger la formation (introuvable ou erreur serveur).";
        this.loading = false;
      },
    });
  }



  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    this.saving = true;
    this.errorMessage = '';

    // payload without weird types
    const payload: Training = {
      name: this.model.name.trim(),
      description: this.model.description.trim(),
      price: Number(this.model.price),
      stock: Number(this.model.stock),
      quantity: Number(this.model.quantity),
    };

    if (this.isEditMode && this.trainingId !== null) {
      this.apiService.updateTraining(this.trainingId, payload).subscribe({
        next: (updated) => {
          // update "original" so reset returns to latest saved version
          this.model = { ...updated };
          this.originalModel = { ...this.model };
          this.saving = false;


          this.router.navigateByUrl('/admin-trainings', {
            state: { flash: { type: 'success', text: 'Formation mise à jour avec succès.' } }
          });

        },
        error: () => {
          this.errorMessage = "Erreur lors de la mise à jour.";
          this.saving = false;
        },
      });
    } else {
      this.apiService.addTraining(payload).subscribe({
        next: (created) => {
          this.saving = false;

          // after create, you can redirect to details or list
          this.router.navigateByUrl('/admin-trainings', {
            state: { flash: { type: 'success', text: 'Formation créée avec succès.' } }
          });
        },
        error: () => {
          this.errorMessage = "Erreur lors de la création.";
          this.saving = false;
        },
      });
    }
  }

  resetForm(form: NgForm): void {
    if (this.isEditMode && this.originalModel) {
      form.resetForm({ ...this.originalModel });
    } else {
      form.resetForm({ ...this.defaultModel });
    }
  }
}
