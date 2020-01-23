import { Component, OnInit } from '@angular/core';
import { DataLookupService } from '../services/data-lookup.service';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-representantes-lookup',
  templateUrl: './representantes-lookup.component.html',
  styleUrls: ['./representantes-lookup.component.css']
})
export class RepresentantesLookupComponent implements OnInit {

  // inputs
  idRepres: number;
  idEvento: number;
  lookRepres: string;
  lookEvento: string;

  // updatelist: any[] = ['representantes'];
  updatelist: any[] = ['representantes', 'despesaseventos'];
  representantes: any[] = [];
  despesaseventos: any[] = [];

  constructor(private datalookup: DataLookupService, private layout: LayoutComponent) {

    this.datalookup.emitUpdateComplete.subscribe(complete => {

      console.log('representantes-lookup:<emitUpdateStatus>');
      this.carregaDataset();

    });

  }

  ngOnInit() {

    console.log('representantes: <ngOnInit()>');
    this.carregaDataset();

  }

  carregaDataset() {
    console.log('representantes:<carregaDataset>');
    console.log(this.updatelist);
    this.updatelist.map(upd => {
      if (this[upd]) {
        console.log('Atribui o valor na variável ' + upd);
        this[upd] = this.datalookup.getUserData(upd);
      } else {
        console.log('Necessário criar a variável ' + upd);
        this.layout.showError('Necessário criar a variável ' + upd);
      }
    });
  }

  onSelectData(event: any) {

    console.log('representantes-lookup(onSelectData): ' + JSON.stringify(event));

  }

}
