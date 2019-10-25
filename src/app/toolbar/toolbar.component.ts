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

  constructor( private auth: AuthService ) {

    this.auth.emitisLoggin.subscribe(ok => this.useractive = ok);

  }

  ngOnInit() {
  }

  onBtnSlideClick() {

    this.sidmenu = !this.sidmenu;
    this.emitSidemenu.emit(this.sidmenu);

  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {

    this.auth.emitisLoggin.unsubscribe();

  }

}
