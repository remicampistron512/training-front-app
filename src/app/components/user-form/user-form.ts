import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../model/user/user.model';
import { UserService } from '../../services/user/user.service';
import { ApiService } from '../../services/api/api-service';
import { HashService } from '../../services/hash.service';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  // Formulaire template-driven (ngModel)
  imports: [FormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {

  // Modèle lié au formulaire (valeurs par défaut)
  user: User = {
    id: new Date().getTime().toString(),
    name: '',
    firstName: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    role: '',
    passwordHash: ''
  };

  constructor(
    private userService: UserService,      // (si tu l'utilises pour de la logique locale)
    private router: Router,                // navigation après création
    private users: ApiService,             // appels API (création user)
    private hash: HashService,             // hash du mot de passe
    private cdr: ChangeDetectorRef,         // forçage éventuel de rafraîchissement de vue
    private auth: AuthService               // permet de savoir si l'utilisateur est admin ou non'
  ) {}

  // Handler appelé par le bouton "Enregistrer"
  protected onSaveUser(): void {
    this.push();
  }

  // Prépare les données (hash du mot de passe) puis envoie la création à l'API

  async push(): Promise<void> {
    // Ne jamais envoyer le mot de passe en clair : on calcule le hash côté front (démo)
    this.user.passwordHash = await this.hash.hashPassword(this.user.password);

    // Appel API : création utilisateur
    this.users.addUser(this.user).subscribe({
      next: (created) => {
        console.log('Created:', created);
        if(this.auth.isAdmin()) {
          // Redirection vers la liste des utilisateurs
          this.router.navigate(['/userList']);
        } else {
          this.router.navigate(['/trainings']);
        }

        // Forçage éventuel de l'update (souvent inutile si change detection standard)
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error:', err),
    });
  }
}
