import { Component, OnInit, Input } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

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

  constructor() { }

  ngOnInit() {

    if (!this.colsearch) {
      this.colsearch = Object.keys(this.columns)[0];
    }

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
      // this.addColumns(Object.keys(this.dataset[0]));
      // this.columns.push(Object.keys(this.dataset[0]));

      // console.log(this.dataset);
      // console.log(this.columns);

    }
  }

  addColumns(cols: any) {

    let columns: any[] = [];
    let column: any;
    let cap: string;
    cols.map((col, i) => {
      // tslint:disable-next-line: max-line-length
      cap = col.substr(0, 1).toUpperCase() + col.substr(1).toLocaleLowerCase();
      column = {id: i, name: col, caption: cap, type: typeof(this.dataset[0][col])};
      // columns = {...columns, column };
      columns.push(column);
    });

    // console.log('columns: ' + JSON.stringify(columns));

    return columns;

  }

  addCheckField() {

    let json: any[];
    json = this.dataset.map(data => {
      // data = {...data, check: false};
      // console.log('data: ' + JSON.stringify(data));
      json = {...data, check: false};
      return data;
    });

    // console.log('json: ' + JSON.stringify(json));

    return json;

  }

  coletar(chave: string, check: boolean) {

    const lidos = this.dataset
      .filter(row => {
        if (row.codigo == chave) { row.check = check; }
        return row.check;
      }).length;

    // limpa o campo de busca...
    this.search = '';

    this.pcol = Math.round(((lidos * 100) / this.dataset.length));

    // this.pcol = this.dataset.reduce(a => (a.lido == 'true') ? 1 : 0);

    // console.log('pcol: ' + this.pcol);

  }

}
