import { Component, signal,OnInit } from '@angular/core';
import {Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive} from '@angular/router';
import { filter } from 'rxjs/operators';
import { SearchBar } from './components/search-bar/search-bar';
import {AuthService} from './services/auth/auth.service';
import {ThemeService} from './services/theme.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SearchBar, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('training-front-app');
  authService ;
  showSearchBar = false;

  constructor(private router: Router, authService:AuthService, public theme:ThemeService) {
    this.authService = authService;
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe(() => {
        // show ONLY on /trainings (also covers /trainings?x=... etc)
        this.showSearchBar =
          this.router.url.startsWith('/trainings') ||
          this.router.url.startsWith('/admin-trainings');
      });
  }
  ngOnInit(): void {
    this.theme.init();
  }

}
