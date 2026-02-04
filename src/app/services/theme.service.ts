import { Injectable } from '@angular/core';
type Theme =  'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private readonly KEY= "theme";
  private theme: Theme = 'light';

  init():void {
    const saved = localStorage.getItem(this.KEY) as Theme || null;
    this.theme = saved === 'dark' ? 'dark' : 'light';
    this.apply();
  }

  get current():Theme {
    return this.theme;
  }

  get isDark(): boolean {
    return this.theme === 'dark';
  }

  toggle(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(this.KEY, this.theme);
    this.apply();
  }

  private apply(): void {
    document.documentElement.setAttribute('data-bs-theme', this.theme);
  }
}
