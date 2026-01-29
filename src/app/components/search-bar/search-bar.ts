import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrainingSearchService } from '../../services/search-bar/training-search.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.html',
})
export class SearchBar {
  term = '';

  constructor(private search: TrainingSearchService) {}

  onInputChange(value: string) {
    this.search.setTerm(value);
  }
}
