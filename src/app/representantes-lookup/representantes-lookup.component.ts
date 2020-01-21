import { Component, OnInit } from '@angular/core';
import { DataLookupService } from '../services/data-lookup.service';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-representantes-lookup',
  templateUrl: './representantes-lookup.component.html',
  styleUrls: ['./representantes-lookup.component.css']
})
export class RepresentantesLookupComponent implements OnInit {

  // updatelist: any[] = ['representantes'];
  updatelist: any[] = ['representantes', 'despesaseventos'];
  representantes: any[] = [];
  despesaseventos: any[] = [];

  constructor(private datalookup: DataLookupService, private layout: LayoutComponent) {

    console.log('representantes: <contructor>');

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

  ngOnInit() {
  }

  onSelectData(event: any) {

    // console.log('representantes-lookup(onSelectData): ' + JSON.stringify(event));

  }

}
