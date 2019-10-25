import { Component, Output } from '@angular/core';
import { setTheme } from 'ngx-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @Output() title = 'Grupo K1 App';

  constructor() {
    setTheme('bs4'); // bs3
  }

}
