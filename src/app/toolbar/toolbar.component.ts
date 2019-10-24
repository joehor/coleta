import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Output() emitSidemenu = new EventEmitter();
  useractive = false;
  sidmenu = false;

  constructor( private auth: AuthService ) { }

  ngOnInit() {
    this.useractive = this.auth.isAuthenticated();
  }

  onBtnSlideClick() {

    this.sidmenu = !this.sidmenu;
    this.emitSidemenu.emit(this.sidmenu);

  }

}
