import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }

  setTheme(theme: string) {
    if (theme === 'kappesberg') {
      document.documentElement.style.setProperty('--main-bgcolor', '#e21932');
      document.documentElement.style.setProperty('--main-bgcolor-hover', '#eee');
      document.documentElement.style.setProperty('--main-sidebarimage', 'url(./assets/images/LogoPortalK1.png)');
    }
    if (theme === 'purple') {
      document.documentElement.style.setProperty('--main-bgcolor', 'rebeccapurple');
      document.documentElement.style.setProperty('--main-bgcolor-hover', 'mediumpurple');
      document.documentElement.style.setProperty('--main-sidebarimage', 'url(./assets/images/LogoPortalUZ.png)');
    }
    if (theme === 'gray') {
      document.documentElement.style.setProperty('--main-bgcolor', 'rgb(2, 61, 89)');
      document.documentElement.style.setProperty('--main-bgcolor-hover', 'rgb(20, 163, 189)');
      document.documentElement.style.setProperty('--main-sidebarimage', 'url(./assets/images/logoPortalPremium.png)');
    }
    if (theme === 'red') {
      document.documentElement.style.setProperty('--main-bgcolor', 'rgb(166, 12, 40)');
      document.documentElement.style.setProperty('--main-bgcolor-hover', 'lightcoral');
      document.documentElement.style.setProperty('--main-sidebarimage', 'url(./assets/images/Idelli2013_phone.png)');
    }
    if (theme === 'orange') {
      document.documentElement.style.setProperty('--main-bgcolor', 'rgb(236, 102, 7)');
      document.documentElement.style.setProperty('--main-bgcolor-hover', 'rgb(0, 149, 219)');
      document.documentElement.style.setProperty('--main-sidebarimage', 'url(./assets/images/logoPortalMyHome.png)');
    }

    this.saveTheme(theme);
  }

  saveTheme(theme: string) {

    localStorage.setItem('colortheme', theme);

  }
}
