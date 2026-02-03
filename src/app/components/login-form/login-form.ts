import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ApiService} from '../../services/api/api-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  @Output() add = new EventEmitter<{login: string,password:string}>();
  enteredLogin= '';
  enteredPassword= '';
  user: any;
  error: string | null = null;
  constructor(private apiService: ApiService,private router: Router) {
  }

  getUserByEmail():any {
    this.apiService.getUserByEmail(this.enteredLogin).subscribe({
      next: (user) => {
        if (!user) {
          console.log('auth not ok (user not found)');
          return;
        }
        this.user = user[0];
        if (this.user.password === this.enteredPassword) {
          console.log('auth ok');
          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigateByUrl('/trainings'); // or '/'
        } else {
          console.log('auth not ok (bad password)');
        }

      },
      error: (err) => {
        this.error = err?.message ?? 'Erreur API';
        this.user = [];
      }
    });
  }
  onSubmit() {
    this.getUserByEmail();

  }

  isValidPassword()  {
    return this.user.password === this.enteredPassword;
  }
}
