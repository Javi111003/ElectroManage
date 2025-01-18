import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>(this.getPreferredScheme());
  theme$ = this.themeSubject.asObservable();

  constructor() {
    document.body.className = this.getPreferredScheme();
  }

  private getPreferredScheme(): 'dark' | 'light' {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    return darkThemeMq.matches ? 'dark' : 'light';
  }

  setTheme(theme: string) {
    this.themeSubject.next(theme);
    document.body.className = theme;
  }
}

