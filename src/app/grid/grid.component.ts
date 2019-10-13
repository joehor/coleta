import { Component, OnInit, Input } from '@angular/core';
import { DataLookupService } from '../services/data-lookup.service';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  // variáveis para injeção ...
  @Input() datasource: any[] = [];
  @Input() datacolumns: any[] = [];
  @Input() apiroute: string;

  // datasource padrão...
  datanotfound: any[] = [{Aviso: 'Nenhum registro encontrado'}];
  // variaveis locais...
  apisuccess = false;
  currentPage = 1;
  page = 1;
  pagecount = 2;
  pesquisa = '';

  constructor( private datalookup: DataLookupService ) { }

  ngOnInit() {

    // se não trouxe nada mostra mensagem sem registro
    if (!this.datasource) { this.datasource = this.datanotfound; }

    this.addcolumns(this.datasource);

    // verifica se tem mais de uma página a ser exibida ...
    this.addpagination();

  }

  addpagination() {

  }

  addcolumns(ds: any) {

    this.datacolumns = Object.keys(ds[0]).map((col, index) => {
      return {
        id: index,
        name: col,
        caption: col.substr(0, 1).toUpperCase() + col.substr(1).toLowerCase(), // torna a letra inicial maiúscula
        type: typeof(ds[0][col]),
        sort: 0, // ordenação 0=nenhum; 1=ascendente; 2=descendente
        visible: (col.substr(0, 1) !== '_') // invisivel se iniciar com "_" (sublinhado)
      };
    });

  }

  visiblecolumns() {
    return this.datacolumns.filter(col => {
      return col.visible;
    }).length;
  }

  ordenar(campo: string, sort: number) {

    const nsort = ((sort === 0) ? 1 : ((sort === 1) ? -1 : 1));
    const isAsc = sort === 1;

    // marca a coluna ordenada...
    this.datacolumns.map(col => {
      if (col.name === campo) { col.sort = nsort; } else { col.sort = 0; }
    });

    this.datasource.sort((a, b) => {
     return this.compare(a[campo].toString().toLocaleLowerCase(), b[campo].toString().toLocaleLowerCase(), isAsc);
    });

  }

  compare(a: string, b: string, isAsc: boolean) {

    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);

  }

  pesquisar() {

    this.getDataFromApi(this.apiroute, this.pesquisa, 1, 10);

  }

  pageChanged(event: any) {

    this.page = event.page;
    this.getDataFromApi(this.apiroute, this.pesquisa, this.page, 10);

  }

  getDataFromApi(api: string, pesq: string, page: number, pagecount: number) {

    // console.log('getData: ' + JSON.stringify(this.datasource.getData('j', 1, 10)));
    this.apisuccess = false;

    this.datalookup.getData(api, pesq, page, pagecount).subscribe(
      data => {
        if (!data) {
          console.log('Não encontrado!');
          this.datasource = this.datanotfound;
          this.apisuccess = true;
          this.pagecount = 0;
        } else {
          this.datasource = data.Data;
          this.apisuccess = data.Success;
          this.pagecount = --data.Paginas.PageCount;
        }
        this.addcolumns(this.datasource);
      }
    );
  }

}
