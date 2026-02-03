import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {User} from '../../model/user/user.model';
import {UserService} from '../../services/user/user.service';
import {Router} from '@angular/router';

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
    id:0,
    name: '',
    firstName: '',
    address: '',
    phone: '',
    email: '',
    password: '',
  };
  constructor(private userService: UserService, private router: Router) { }
  protected onSaveUser() {

    this.userService.addUser(this.user);
    this.router.navigate(['/userList']); // navigate AFTER save/log
  }
}
