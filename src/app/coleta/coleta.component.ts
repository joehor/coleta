import { Component, OnInit, Input } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-coleta',
  templateUrl: './coleta.component.html',
  styleUrls: ['./coleta.component.css']
})
export class ColetaComponent implements OnInit {

  @Input() dataset: any[] = [];
  @Input() colsearch: string;
  columns: any[] = [];
  search = '';
  pcol = 0;

  constructor(public toastService: ToastService) { }

  ngOnInit() {

    if (this.dataset.length === 0) {

      this.dataset.push({codigo: 1, descricao: 'primeiro item', barras: '11111'});
      this.dataset.push({codigo: 2, descricao: 'segundo item', barras: '22222'});
      this.dataset.push({codigo: 3, descricao: 'terceiro item', barras: '33333'});
      this.dataset.push({codigo: 4, descricao: 'quarto item', barras: '44444'});
      this.dataset.push({codigo: 5, descricao: 'quinto item', barras: '55555'});
      this.dataset.push({codigo: 6, descricao: 'sexto item', barras: '66666'});

      // adiciona o campo check no json...
      this.dataset = this.addCheckField();

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

  addCheckField() {

    let json: any;
    json = this.dataset.map(data => {
      data = {...data, check: false};
      return data;
    });

    // console.log('json: ' + JSON.stringify(json));

    return json;

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

  compare(a, b, isAsc) {

    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);

  }

  mudacolumnsearch(campo: string) {

    this.colsearch = campo;

    console.log('Mudou para o campo: ' + campo);

  }
}
