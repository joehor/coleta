import { Component } from '@angular/core';
import { setTheme } from 'ngx-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Coleta';

  constructor() {
    setTheme('bs4'); // bs3
  }
}
