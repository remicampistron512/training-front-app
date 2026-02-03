import {ChangeDetectorRef, Component} from '@angular/core';
import {User} from '../../model/user/user.model';
import {RouterLink} from '@angular/router';
import {ApiService} from '../../services/api/api-service';

@Component({
  selector: 'app-user-list',
  imports: [ RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  listUsers : User[] | undefined;
  error: string | null = null;
  constructor(private userService: ApiService,private cdr: ChangeDetectorRef) {
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
}



