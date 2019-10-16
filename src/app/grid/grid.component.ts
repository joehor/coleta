import { Component, OnInit, Input } from '@angular/core';
import { DataLookupService } from '../services/data-lookup.service';

interface Httpcodes {
  code: number;
  erro: string;
  mensagem: string;
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})

export class GridComponent implements OnInit {

  // variáveis para injeção...
  @Input() datasource: any[] = [];
  @Input() apiroute: string;
  @Input() inputcolumns: string[];

  // datasource padrão...
  datanotfound: any[] = [{Aviso: 'Nenhum registro encontrado'}];

  // variaveis locais...
  columns: string[];
  datacolumns: any[] = [];
  apierror = false;
  currentPage = 1;
  page = 1;
  pagecount = 1;
  pesquisa = '';
  pesquisaalterada = false;
  pesquisando = false;

  // Event emitter...
  httperror: Httpcodes;

  constructor( private datalookup: DataLookupService ) { }

  ngOnInit() {

    // se inscreve no método erro que será disparado pela intrução http
    // this.httperror = this.datalookup.getError<any>().

    // console.log('httperror: ' + JSON.stringify(this.httperror));


    // se não trouxe nada mostra mensagem sem registro
    if (!this.datasource || this.datasource.length === 0) { this.datasource = this.datanotfound; }
    // se não informou colunas pega do próprio dataset ...
    if (!this.inputcolumns || this.inputcolumns.length === 0) { this.columns = Object.keys(this.datasource[0]); }

    this.addcolumns(this.datasource);

    // console.log('this.columns: ' + this.columns);
    // console.log('this.columns.lenght: ' + this.columns.length);

    // verifica se tem mais de uma página a ser exibida ...
    this.addpagination();

  }

  addpagination() {

  }

  // formata as colunas para exibição...
  addcolumns(ds: any) {

    if (ds) {
      const cols = (!this.inputcolumns ? Object.keys(ds[0]) : this.inputcolumns);
      this.datacolumns = cols.map((col, index) => {
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

  }

  // conta quantas colunas estão visíveis...
  visiblecolumns() {
    return this.datacolumns.filter(col => {
      return col.visible;
    }).length;
  }

  // função que ordena as colunas...
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

  // função que compara
  compare(a: string, b: string, isAsc: boolean) {

    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);

  }

  // busca os dados da API...
  pesquisar() {

    this.getDataFromApi(this.apiroute, this.pesquisa, 1, 10);

  }

  // marca a pesquisa como alterada para chamar a pesquisa novamente...
  resetapesquisa() {

    this.pesquisaalterada = true;

  }

  // alterando a página deve refazer a busca na API...
  pageChanged(event: any) {

    if (this.page !== this.currentPage) {
      this.page = this.currentPage;
      this.getDataFromApi(this.apiroute, this.pesquisa, this.page, 10);
    }

  }

  // serviço que busca os dados da API...
  getDataFromApi(api: string, pesq: string, page: number, pagecount: number) {

    // console.log('getData: ' + JSON.stringify(this.datasource.getData('j', 1, 10)));
    this.pesquisando = true;
    this.apierror = false;
    this.pesquisaalterada = false;

    this.datalookup.getData(api, pesq, page, pagecount)
      .subscribe(
      data => {
        if (!data.Data) {
          console.log('Não encontrado!');
          this.pesquisando = false;
          this.datasource = this.datanotfound;
          this.apierror = true;
          this.pagecount = 0;
          return [];
        } else {
          console.log('Encontrado');
          this.pesquisando = false;
          this.datasource = data.Data;
          this.apierror = !data.Success;
          this.pagecount = --data.Paginas.PageCount;
        }
        this.addcolumns(data.Data);
      },
      error => {
        this.pesquisando = false;
        this.apierror = true;
        this.httperror = error;
        if (error.code === 401) { this.httperror.mensagem = 'Falha na autenticação, efetue novo logon'; }
      }
    );
  }

}
