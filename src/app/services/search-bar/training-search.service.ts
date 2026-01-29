import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TrainingSearchService {
  private readonly termSubject = new BehaviorSubject<string>('');
  readonly term$ = this.termSubject.asObservable();

  setTerm(term: string) {
    this.termSubject.next(term);
  }
}
