import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ChangeDetectorRef  } from '@angular/core';
import { DataLookupService } from '../services/data-lookup.service';
import { BsModalRef, BsModalService  } from 'ngx-bootstrap/modal';
import { TabHeadingDirective } from 'ngx-bootstrap';

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

  modalRef: BsModalRef;
  // variáveis para injeção...
  @Input() datasource: any[] = [];
  @Input() apiroute: string;
  @Input() inputcolumns: string[];
  @Input() pagesize = 10;

  // evento que emite o item slecionado...
  @Output() emitDataSelected = new EventEmitter<any>();

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

  constructor( private datalookup: DataLookupService, private modalService: BsModalService, private changeDetection: ChangeDetectorRef ) { }

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

    if (this.pesquisaalterada) {
      this.page = 1;
      this.currentPage = 1;
    }
    this.getDataFromApi(this.apiroute, this.pesquisa, 1, this.pagesize);

  }

  // marca a pesquisa como alterada para chamar a pesquisa novamente...
  resetapesquisa() {

    this.pesquisaalterada = true;

  }

  // alterando a página deve refazer a busca na API...
  pageChanged(event: any) {

    console.log('event: ' + JSON.stringify(event));
    this.page = event.page;
    this.getDataFromApi(this.apiroute, this.pesquisa, event.page, this.pagesize);

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
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
          this.pagecount = data.Paginas.PageCount;
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

  // impprime a tabela
  printDataset() {
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    const printContent = document.getElementById('tabledataset');
    // tslint:disable-next-line: max-line-length
    let printTemplate = '<html><head>';

    printTemplate += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"/>';

    printTemplate += '<style>';
    printTemplate += '.footer {';
    printTemplate += '  display: none;';
    printTemplate += '}';
    printTemplate += '</style>';

    printTemplate += '</head><body><bodycontent></body></html>';

    // prepara o body substituindo o <bodycontent> pelo conteúdo da table ...
    const body = printTemplate.replace('<bodycontent>', printContent.innerHTML);

    WindowPrt.document.write(body);
    WindowPrt.document.close();
    WindowPrt.focus();
    // WindowPrt.print();
    // WindowPrt.close();
  }

  // emite a informação do item selecionado...
  selectdata(datasel: any) {

    // envia o dado para quem quiser pegar...
    this.emitDataSelected.emit(datasel);

  }

  showhidecolumn(col: any) {

    col.visible = !col.visible;
    this.changeDetection.detectChanges();

  }

}
