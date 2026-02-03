import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn():boolean {
      return !!localStorage.getItem('user');
  }
  isAdmin(): boolean {
    const userJson = localStorage.getItem('user');
    if (!userJson) return false;

    const user = JSON.parse(userJson);
    console.log(localStorage.getItem('user'));
    return user[0].role === 'admin';

  }
  logout():void {
    localStorage.removeItem('user');
  }
}
