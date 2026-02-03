import { Component } from '@angular/core';
import {User} from '../../model/user/user.model';
import {UserService} from '../../services/user/user.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [ RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  listUsers : User[] | undefined;
  constructor(private userService: UserService) { }

  ngOnInit() : void {
    this.listUsers = this.userService.getUsers();
  }
}
