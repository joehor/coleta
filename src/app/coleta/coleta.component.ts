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
  @Input() dataset: any[] = [];
  @Input() colsearch: string;
  mudadata: any;
  columns: any[] = [];
  search = '';
  pcol = 0;

  constructor(public toastService: ToastService, private modalService: BsModalService) { }

  ngOnInit() {

    if (this.dataset.length === 0) {

      this.dataset.push({codigo: 1, descricao: 'primeiro item', barras: '11111'});
      this.dataset.push({codigo: 2, descricao: 'segundo item', barras: '22222'});
      this.dataset.push({codigo: 3, descricao: 'terceiro item', barras: '33333'});
      this.dataset.push({codigo: 4, descricao: 'quarto item', barras: '44444'});
      this.dataset.push({codigo: 5, descricao: 'quinto item', barras: '55555'});
      this.dataset.push({codigo: 6, descricao: 'sexto item', barras: '66666'});

    }

    this.reloadDataSet(this.dataset);

  }

  reloadDataSet(dataset: any) {

    console.log('Tipo de dataset: ' + typeof(dataset));

    if (dataset.length > 0) {
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

    columns = cols.map((col, i) => {
      cap = col.substr(0, 1).toUpperCase() + col.substr(1).toLocaleLowerCase();
      column = {id: i, name: col, caption: cap, type: typeof(this.dataset[0][col]), sort: 0};

      return column;
    });

    // console.log('columns: ' + JSON.stringify(columns));

    return columns;

  }

  addCheckField(dataset: any) {

    return dataset.map(data => {
      return {...data, check: false};
    });

  }

  coletar(chave: string, check: boolean) {

    const reg = this.dataset.find(row => row[this.colsearch] == chave);
    if (reg) { reg.check = check; }

    const lidos = this.dataset.filter(row => row.check).length;

    // limpa o campo de busca...
    this.search = '';

    this.pcol = Math.round(((lidos * 100) / this.dataset.length));

  }

  ordenar(campo: string, sort: number) {

    const nsort = ((sort == 0) ? 1 : ((sort == 1) ? -1 : 1));
    const isAsc = sort === 1;

    // marca a coluna ordenada...
    this.columns.map(col => {
      if (col.name == campo) { col.sort = nsort; } else { col.sort = 0; }
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

    console.log('Mudou para o campo: ' + campo);

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  mudaDataSet(novodataset: any) {

    console.log('novodataset: ' + novodataset);
    console.log('JSON.stringify(novodataset): ' + JSON.stringify(novodataset));

    if (typeof(novodataset) === 'string') { novodataset = JSON.parse(novodataset); }

    this.reloadDataSet(novodataset);

  }

}
