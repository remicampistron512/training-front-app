import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {User} from '../../model/user/user.model';
import {RouterLink} from '@angular/router';
import {ApiService} from '../../services/api/api-service';
import {FlashService} from '../../services/flash/flash.service';

@Component({
  selector: 'app-user-list',
  imports: [RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  listUsers : User[] | undefined;
  error: string | null = null;

  constructor(private userService: ApiService,
              private cdr: ChangeDetectorRef,
              private flash: FlashService) {
  }

  ngOnInit() : void {
    this.getUsers();
  }
  getUsers(){
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.listUsers = data ?? [];
        this.cdr.detectChanges(); // force view update
      },
      error: (err) => {
        this.error = err?.message ?? 'Erreur API';
        this.listUsers = [];
        this.cdr.detectChanges();
      }
  })
  }

  protected removeUser(id: string) {
    this.userService.removeUser(id).subscribe({
      next: (data) => {
        console.log('Deleted:', data);
        this.flash.success('Utilisateur supprimé avec succès.')
        this.getUsers();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error:', err),

    })
  }
}



