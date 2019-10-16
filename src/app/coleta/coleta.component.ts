import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { BsModalRef, BsModalService  } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-coleta',
  templateUrl: './coleta.component.html',
  styleUrls: ['./coleta.component.css']
})
export class ColetaComponent implements OnInit {

  modalRef: BsModalRef;
  @Input() rootdataset: any[] = [];
  @Input() colsearch: string;
  @Input() canfilter = true;
  @Input() rootElement = '';
  @Input() canProgress = true;
  @Input() canColet = true;
  urlapi = '';
  token = '';
  searchText: string;
  searchKey: string;
  filterdataset: any[] = [];
  dataset: any[] = [];
  mudadata: any;
  columns: any[] = [];
  search = '';
  pcol = 0;
  page = 0;
  pagecount = 0;

  constructor(public toastService: ToastService, private modalService: BsModalService) { }

  ngOnInit() {

    if (this.rootdataset.length === 0) {

      this.rootdataset.push({codigo: 1, descricao: 'primeiro item', barras: '11111'});
      this.rootdataset.push({codigo: 2, descricao: 'segundo item', barras: '22222'});
      this.rootdataset.push({codigo: 3, descricao: 'terceiro item', barras: '33333'});
      this.rootdataset.push({codigo: 4, descricao: 'quarto item', barras: '44444'});
      this.rootdataset.push({codigo: 5, descricao: 'quinto item', barras: '55555'});
      this.rootdataset.push({codigo: 6, descricao: 'sexto item', barras: '66666'});

    }

    this.dataset = this.rootdataset;

    this.reloadDataSet(this.dataset);

  }

  reloadDataSet(dataset: any) {

    // console.log('Tipo de dataset: ' + typeof(dataset));
    if (this.rootElement && this.rootElement !== '') { dataset = dataset[this.rootElement || 0]; }

    // se tem colunas _page e _pagecount assume paginação ...
    if (Object.keys(dataset[0]).filter(key => key === '_page').length > 0) { this.page = dataset[0]['_page']; }
    if (Object.keys(dataset[0]).filter(key => key === '_pagecount').length > 0) { this.pagecount = dataset[0]['_pagecount']; }

    console.log('page: ' + dataset[0]['_page']);
    console.log('pagecount: ' + dataset[0]['_pagecount']);
    console.log('dataset: ' + JSON.stringify(dataset));

    if (dataset.length > 0) {
      this.rootdataset = dataset;
      // adiciona o campo check no json...
      this.dataset = this.addCheckField(dataset);

      // pega as colunas...
      this.columns = this.addColumns(Object.keys(this.dataset[0]));

      // define a coluna a ser pesquisada..
      if (!this.colsearch) {
        this.colsearch = Object.keys(this.dataset[0])[0];
      }
    }

  }

  addColumns(cols: any) {

    let columns: any;
    let column: any;
    let cap: string;
    let vis: boolean;

    columns = cols.map((col: any, i: number) => {
      cap = col.substr(0, 1).toUpperCase() + col.substr(1).toLocaleLowerCase();
      vis = col.substr(0, 1) !== '_'; // remove os campos que iniciam com undeline ...
      column = {id: i, name: col, caption: cap, type: typeof(this.dataset[0][col]), sort: 0, visible: vis};
      return column;
    });

    // console.log('columns: ' + JSON.stringify(columns));

    // adiciona a opção todos
    columns.unshift({id: -1, name: '', caption: '-- Todos --', type: 'string', sort: 0, visible: false});
    //  | filter : 'true' : 'visible'

    // console.log('columns: ' + JSON.stringify(columns));

    return columns;

  }

  addCheckField(dataset: any) {

    return dataset.map(data => {
      return {...data, check: false};
    });

  }

  coletar(chave: string, check: boolean) {

    const reg = this.dataset.find(row => row[this.colsearch].toString() === chave);
    if (reg) { reg.check = check; }

    const lidos = this.dataset.filter(row => row.check).length;

    // limpa o campo de busca...
    this.search = '';

    this.pcol = Math.round(((lidos * 100) / this.dataset.length));

  }

  reloadProgressBar() {

    // console.log('Recalculando filterdataset: ' + this.filterdataset.length.toString());
    this.pcol = Math.round( (this.dataset.filter(row => row.check).length * 100) / this.dataset.length );

  }

  ordenar(campo: string, sort: number) {

    const nsort = ((sort === 0) ? 1 : ((sort === 1) ? -1 : 1));
    const isAsc = sort === 1;

    // marca a coluna ordenada...
    this.columns.map(col => {
      if (col.name === campo) { col.sort = nsort; } else { col.sort = 0; }
    });

    this.dataset.sort((a, b) => {
     return this.compare(a[campo].toString().toLocaleLowerCase(), b[campo].toString().toLocaleLowerCase(), isAsc);
    });

  }

  compare(a: string, b: string, isAsc: boolean) {

    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);

  }

  mudacolumnsearch(campo: string) {

    this.colsearch = campo;

    // console.log('Mudou para o campo: ' + campo);

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  mudaDataSet(novodataset: any) {

    // console.log('novodataset: ' + novodataset);

    if (typeof(novodataset) === 'string' && novodataset !== '') {
      novodataset = JSON.parse(novodataset);
      this.reloadDataSet(novodataset);
    }

    this.reloadProgressBar();
    this.modalRef.hide();

  }

  visibleColumns() {

    return this.columns.filter(col => col.visible).length;

  }

  getFromAPI() {
    return [{id: 1}];
  }

}
