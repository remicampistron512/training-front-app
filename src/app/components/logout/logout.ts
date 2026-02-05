import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import {FlashService} from '../../services/flash/flash.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  template: '' // no UI needed
})
export class Logout implements OnInit {


  constructor(private authService: AuthService,
              private router: Router,
              private flash: FlashService) {}

  ngOnInit(): void {
    this.flash.success('Déconnecté avec succès.');
    this.authService.logout();

    this.router.navigateByUrl('/login'); // or '/'
  }
}
