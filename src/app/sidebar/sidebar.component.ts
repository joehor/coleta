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

  constructor( private dataLookup: DataLookupService, private auth: AuthService ) {

    console.log('slidemenu:construtor');
    if (this.auth.isAuthenticated()) {
      this.getDataFromApi('Representantes/Menus', '...', 1, 100);
    }

  }

  ngOnInit() {

    this.auth.emitisLoggin.subscribe(ok => {
      if (ok) {
        console.log('Buscando menus auth : ' + ok);
        this.getDataFromApi('Representantes/Menus', '...', 1, 100);
      }
    });

    if (!this.auth.isAuthenticated) {
      // busca os menus ..
      console.log('Buscando menus init');
      this.getDataFromApi('Representantes/Menus', '...', 1, 100);
    } else {
      this.datasource.push({id: 1, caption: 'Home', hint: 'Pagina inicial', icon: 'home', action: '/home', class: '', submenu: ''});
    }

  }

  onSlide() {
    this.open = !this.open;
    this.emitSlide.emit(this.open);
    console.log('sidebar onSlide: ' + this.open);
  }

  onSelectItem() {
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
          console.log('Não encontrado!');
          // this.datasource = this.datanotfound;
          this.loading = false;
        } else {
          console.log('Encontrado');
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


}