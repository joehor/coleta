import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { getLocaleEraNames } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Output() emitSidemenu = new EventEmitter();
  useractive = false;
  sidmenu = false;
  notifylist: any[] = [];

  constructor( private auth: AuthService ) {

    this.useractive = this.auth.isAuthenticated();

  }

  ngOnInit() {




    this.notifylist.push({id: 1, assunto: 'teste 1', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis tincidunt leo, nec semper est tempus sit amet. Suspendisse eu ligula eu tellus convallis auctor. Aenean ac pellentesque tellus, at vehicula odio. Pellentesque euismod lacinia libero vitae vehicula. Sed nec ullamcorper quam. Curabitur aliquam interdum posuere. Praesent congue sem eros, sit amet feugiat lectus blandit in. Mauris sed placerat tortor. Quisque porta sed est quis porta. Aliquam erat volutpat. Integer fermentum tellus a lorem suscipit blandit.'});
    this.notifylist.push({id: 2, assunto: 'teste 2', corpo: 'mensagem'});
    this.notifylist.push({id: 3, assunto: 'teste 3', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas venenatis tincidunt leo, nec semper est tempus sit amet. Suspendisse eu ligula eu tellus convallis auctor. Aenean ac pellentesque tellus, at vehicula odio. Pellentesque euismod lacinia libero vitae vehicula. Sed nec ullamcorper quam. Curabitur aliquam interdum posuere. Praesent congue sem eros, sit amet feugiat lectus blandit in. Mauris sed placerat tortor. Quisque porta sed est quis porta. Aliquam erat volutpat. Integer fermentum tellus a lorem suscipit blandit.'});
    this.notifylist.push({id: 4, assunto: 'teste 4', corpo: 'mensagem'});
    this.notifylist.push({id: 5, assunto: 'teste 5', corpo: 'mensagem'});
    this.auth.emitisLoggin.subscribe(ok => this.useractive = ok);

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
