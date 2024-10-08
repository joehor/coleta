import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ThemeService } from '../services/theme.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

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
  theme = 'purple';
  apptitle = environment.apptitle;

  constructor( private themeservice: ThemeService, private auth: AuthService, private route: Router ) {

    this.useractive = this.auth.isAuthenticated();
    this.auth.emitisLoggin.subscribe(logado => this.useractive = logado);

    // aplica o tema salvo...
    this.theme = localStorage.getItem('colortheme');
    if (this.theme) { this.themeservice.setTheme( this.theme ); }

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
    if (document.documentElement.style.getPropertyValue('--main-slidemenu-width') !== '0') {
      document.documentElement.style.setProperty('--main-slidemenu-width', '0');
    } else {
      document.documentElement.style.setProperty('--main-slidemenu-width', '-350px');
    }

  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {

    this.auth.emitisLoggin.unsubscribe();

  }

  changeTheme(theme: string) {

    this.themeservice.setTheme(theme);

  }

  logout() {

    this.auth.logout();
    console.log('toolbar:: sair');
    this.route.navigate(['/home']);

  }

}
