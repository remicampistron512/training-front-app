import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { SearchBar } from './components/search-bar/search-bar';
import { Trainings } from './components/trainings/trainings';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SearchBar, Trainings],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('training-front-app');

  searchTerm = '';
}
