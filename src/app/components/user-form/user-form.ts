import {ChangeDetectorRef,Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {User} from '../../model/user/user.model';
import {UserService} from '../../services/user/user.service';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api/api-service';
import {HashService} from '../../services/hash.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
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
  constructor(private userService: UserService, private router: Router,private users: ApiService,private hash:HashService,private cdr: ChangeDetectorRef ) { }

  protected onSaveUser() {

    this.push();


  }
  async push() {
      this.user.passwordHash = await this.hash.hashPassword(this.user.password);

      this.users.addUser(this.user).subscribe({
      next: (created) => {
        console.log('Created:', created);
        this.router.navigate(['/userList']); // navigate AFTER save/log
        this.cdr.detectChanges();

      },
      error: (err) => console.error('Error:', err),
    });

  }
}
