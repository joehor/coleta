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
    if (theme === 'red') {
      document.documentElement.style.setProperty('--main-bgcolor', 'rgb(166, 12, 40)');
      document.documentElement.style.setProperty('--main-bgcolor-hover', 'lightcoral');
    }
    if (theme === 'orange') {
      document.documentElement.style.setProperty('--main-bgcolor', 'rgb(236, 102, 7)');
      document.documentElement.style.setProperty('--main-bgcolor-hover', 'rgb(0, 149, 219)');
    }

    this.saveTheme(theme);
  }

  saveTheme(theme: string) {

    localStorage.setItem('colortheme', theme);

  }
}
