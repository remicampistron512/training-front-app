import { Component, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

import { SearchBar } from './components/search-bar/search-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SearchBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('training-front-app');

  showSearchBar = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        // show ONLY on /trainings (also covers /trainings?x=... etc)
        this.showSearchBar = this.router.url.startsWith('/trainings');
      });
  }
}
