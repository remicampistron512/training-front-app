import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import { ApiService } from '../../services/api/api-service';
import { HashService } from '../../services/hash.service';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {

  // Événement optionnel émis vers un parent (si tu en as besoin)
  @Output() add = new EventEmitter<{ login: string; password: string }>();

  // Champs du formulaire (template-driven)
  enteredLogin = '';
  enteredPassword = '';

  // Utilisateur chargé depuis l’API (idéalement typé au lieu de any)
  user: any;

  // Message d’erreur affichable côté UI
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private hashService: HashService
  ) {}

  // Cherche l'utilisateur par email/login et vérifie le mot de passe via le hash
  getUserByEmail(): any {
    this.apiService.getUserByEmail(this.enteredLogin).subscribe({
      next: async (user) => {
        // L’API peut renvoyer null/[] si non trouvé
        if (!user || user.length === 0) {
          console.log('auth not ok (user not found)');
          this.error = 'Utilisateur introuvable';
          return;
        }

        // On prend le premier résultat (json-server renvoie souvent un tableau)
        this.user = user[0];

        // Vérification du mot de passe avec le hash (ne jamais comparer en clair)
        const ok = await this.hashService.verifyPassword(
          this.enteredPassword,
          this.user.passwordHash
        );

        if (ok) {
          console.log('auth ok');

          // Stockage de l'utilisateur connecté (attention : éviter d’y stocker le hash)
          // IMPORTANT: ici, tu stockes "user" (le tableau). Souvent on stocke plutôt user[0].
          localStorage.setItem('user', JSON.stringify(user));

          // Redirection après connexion
          this.router.navigateByUrl('/trainings');
        } else {
          console.log('auth not ok (bad password)');
          this.error = 'Mot de passe incorrect';
        }
      },
      error: (err) => {
        // Gestion d’erreur API
        this.error = err?.message ?? 'Erreur API';
        this.user = null;
      }
    });
  }

  // Handler de soumission du formulaire
  onSubmit(): void {
    this.error = null;
    this.getUserByEmail();
  }

  // Méthode héritée d'une ancienne approche : comparaison en clair
  // À éviter / supprimer (la vérification via hashService suffit)
  isValidPassword(): boolean {
    return this.user?.password === this.enteredPassword;
  }
}
