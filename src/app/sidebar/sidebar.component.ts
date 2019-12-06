import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { DataLookupService } from '../services/data-lookup.service';
import { AuthService } from '../services/auth/auth.service';

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

  constructor( private dataLookup: DataLookupService, private auth: AuthService ) {}

  ngOnInit() {

    this.auth.emitisLoggin.subscribe(ok => {
      if (ok) {
        this.getDataFromApi('Representantes/Menus', '%', 1, 100);
      } else {
        this.datasource.push({id: 1, caption: 'Home', hint: 'Pagina inicial', icon: 'home', action: '/home', class: '', submenu: ''});
        this.datasource.push({id: 3, caption: 'Testes', hint: 'Pagina de testes', icon: 'plus', action: '/testes', class: '', submenu: ''});
      }
    });

  }

  onSlide() {
    this.open = !this.open;
    this.emitSlide.emit(this.open);
    // console.log('sidebar onSlide: ' + this.open);
  }

  onSelectItem() {
    // console.log('onSelectItem!');
    this.open = false;
    this.emitSlide.emit(false);
  }

  // serviço que busca os dados da API...
  getDataFromApi(api: string, pesq: string, page: number, pagecount: number) {
    this.loading = true;
    this.dataLookup.getData(api, pesq, page, pagecount)
      .subscribe(
      data => {
        if (!data.Data) {
          // console.log('Não encontrado!');
          // this.datasource = this.datanotfound;
          this.loading = false;
        } else {
          // console.log('Encontrado');
          this.datasource = data.Data;
          this.loading = false;
        }
      },
      error => {
        if (error.code === 401) { this.httperror.mensagem = 'Falha na autenticação, efetue novo logon'; }
        this.loading = false;
      }
    );
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
