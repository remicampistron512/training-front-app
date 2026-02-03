import { Injectable } from '@angular/core';
import {User} from '../../model/user/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  users: User[] = [];

  addUser(customer: User): void {
    this.users.push(customer);
  }

  getUsers(): User[] {
    return this.users;
  }

  removeUser(id: number): void {
    this.users = this.users.filter(c => c.id !== id);
  }
}

