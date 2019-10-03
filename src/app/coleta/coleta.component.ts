import { Component, OnInit, Input } from '@angular/core';

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

    if (this.dataset.length == 0) {

      this.dataset.push({codigo: 1, descricao: 'primeiro item', barras: '11111', lido: false});
      this.dataset.push({codigo: 2, descricao: 'segundo item', barras: '22222', lido: false});
      this.dataset.push({codigo: 3, descricao: 'terceiro item', barras: '33333', lido: false});
      this.dataset.push({codigo: 4, descricao: 'quarto item', barras: '44444', lido: false});
      this.dataset.push({codigo: 5, descricao: 'quinto item', barras: '55555', lido: false});
      this.dataset.push({codigo: 6, descricao: 'sexto item', barras: '66666', lido: false});

      this.columns.push(Object.keys(this.dataset[0]));

      console.log(this.dataset);
      console.log(this.columns);

    }
  }

  coletar(chave: string) {
    let lidos = this.dataset
      .filter(row => {
        if (row.codigo == chave) { row.lido = true; }
        return row.lido;
      }).length;

    this.pcol = Math.round(((lidos * 100) / this.dataset.length));

    // this.pcol = this.dataset.reduce(a => (a.lido == 'true') ? 1 : 0);

    console.log('pcol: ' + this.pcol);

  }

}
