import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { DataLookupService } from '../services/data-lookup.service';
import { AuthService } from '../services/auth/auth.service';
import { NotifyService } from '../services/notify.service';

interface Httpcodes {
  code: number;
  erro: string;
  mensagem: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Output() emitSlide = new EventEmitter();
  open = false;
  datasource: any[] = [];
  // Event emitter...
  httperror: Httpcodes;
  loading = false;
  filtro = '';

  constructor( private dataLookup: DataLookupService, private auth: AuthService, private notify: NotifyService ) {

    this.auth.emitisLoggin.subscribe((active: boolean) => {
      if (!active) { this.menuDefault(); }
      console.log('sidebar:: subscribe active: ' + active);
    });

  }

  ngOnInit() {

    this.getDataFromApi('Representantes/Menus', '%', 1, 100);

    this.auth.emitisLoggin.subscribe(ok => {
      if (ok) {
        this.getDataFromApi('Representantes/Menus', '%', 1, 100);
      }
    });

    // console.log('window.innerWidth: ' + window.innerWidth);

    if (window.innerWidth > 1200) {
      document.documentElement.style.setProperty('--main-slidemenu-width', '0');
      this.open = true;
    }

  }

  onSlide() {

    this.open = !this.open;
    this.emitSlide.emit(this.open);
    console.log('sidebar onSlide: ' + this.open);

  }

  onSelectItem() {

    console.log('onSelectItem!');
    this.open = false;
    this.emitSlide.emit(false);

    // esconde o sidebar
    console.log();
    if (window.innerWidth < 1200) {
    if (document.documentElement.style.getPropertyValue('--main-slidemenu-width') !== '0') {
      document.documentElement.style.setProperty('--main-slidemenu-width', '0');
    } else {
      document.documentElement.style.setProperty('--main-slidemenu-width', '-350px');
    }
    }

  }

  // serviço que busca os dados da API...
  getDataFromApi(api: string, pesq: string, page: number, pagecount: number) {

    this.loading = false;
    if (this.auth.isAuthenticated()) {
      this.dataLookup.getData(api, pesq, page, pagecount)
        .subscribe(
        data => {
          if (!data.Data) {
            console.log('Não encontrado!');
            // this.datasource = this.datanotfound;
            this.loading = false;
          } else {
            console.log('Encontrado');
            this.datasource = data.Data;
            // menus adicionais ...
            // tslint:disable-next-line: max-line-length
            this.datasource.push({id: 33, caption: 'Dashboard', hint: 'Dashboard', icon: 'dashboard', action: '/dashboard', class: '', submenu: ''});
            this.loading = false;
          }
        },
        error => {
          // if (error.code === 401) { this.httperror.mensagem = 'Falha na autenticação, efetue novo logon'; }
          this.notify.emitError('Falha na autenticação, efetue novo logon');
          this.loading = false;
        }
      );
    } else {
      this.menuDefault();
    }
  }

  menuDefault() {
    this.datasource = [];
    this.datasource.push({id: 1, caption: 'Home', hint: 'Pagina inicial', icon: 'home', action: '/home', class: '', submenu: ''});
    this.datasource.push({id: 3, caption: 'Testes', hint: 'Pagina de testes', icon: 'plus', action: '/testes', class: '', submenu: ''});
  }

/*
-- tentando colocar no styles.css
  changeTheme(theme: number) {
    if (theme === 1) {
      document.documentElement.style.setProperty('--main-bgcolor', 'red');
      document.documentElement.style.setProperty('--main-bgcolor-hover', 'lightblue');
    }
    if (theme === 2) {
      document.documentElement.style.setProperty('--main-bgcolor', 'gray');
      document.documentElement.style.setProperty('--main-bgcolor-hover', 'silver');
    }
  }
*/
}
