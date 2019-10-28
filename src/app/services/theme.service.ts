import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  setTheme(theme: string) {
    if (theme === 'purple') {
      document.documentElement.style.setProperty('--main-bgcolor', 'rebeccapurple');
      document.documentElement.style.setProperty('--main-bgcolor-hover', 'mediumpurple');
    }
    if (theme === 'gray') {
      document.documentElement.style.setProperty('--main-bgcolor', 'gray');
      document.documentElement.style.setProperty('--main-bgcolor-hover', 'silver');
    }
  }
}
