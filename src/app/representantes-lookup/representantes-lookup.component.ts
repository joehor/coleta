import { Component, OnInit } from '@angular/core';
import { DataLookupService } from '../services/data-lookup.service';

@Component({
  selector: 'app-representantes-lookup',
  templateUrl: './representantes-lookup.component.html',
  styleUrls: ['./representantes-lookup.component.css']
})
export class RepresentantesLookupComponent implements OnInit {
  testeaviso = 'Atualizando despesaseventos...';

  error: any;
  success: any;
  updatelist: any[] = ['representantes'];
  representantes: any[] = [];
  loading = false;
  loadmessage = '';

  constructor( private datalookup: DataLookupService ) {

    console.log('representantes-constructor: ');

    // this.datasource = this.datalookup.k1data.Data.filter( dt => dt.despesaseventos)[0].despesaseventos;
    this.datalookup.emitUpdateStatus.subscribe(data => {

      console.log('Emite status: ');
      console.log(data);

      this.loading = !data.complete;
      this.loadmessage = data.mensagem;

      if (this.updatelist.find(ds => ds === data.property)) {
        if (data.complete) {
          if (data.error) {
            this.error = {title: 'Falha na requisição!', mensagem: data.mensagem};
          } else {
            this.success = {mensagem: data.mensagem};
            // a propriedade com o mesmo nome do dataset deve ser previamente criada ...
            console.log('datalookup.emitUpdateStatus.subscribe: ' + data.property);
            this[data.property] = this.datalookup.userdata.Data.find(ds => ds[data.property])[data.property];
          }
        }
      }


      /*
      if ((data.property === 'despesaseventos')) {
        console.log('achou despesas eventos');
        this.datasource = this.datalookup.userdata.Data.find(dt => dt.hasOwnProperty('despesaseventos')).despesaseventos;
      }
      if ((data.property === 'representantes')) {
        this.datarepres = this.datalookup.userdata.Data.find(dt => dt.hasOwnProperty('representantes')).representantes;
      }
      */

    }); // this.datalookup.emitUpdateStatus.subscribe(data =>

    console.log('representantes:construtor 2');
    console.log(this.datalookup.userdata);

    // nova chamada ...
    this.datalookup.updateK1List(this.updatelist);

    /*
    let newupdate = [];
    if (this.datalookup.userdata.Data.length > 0) {
      newupdate = this.updatelist
      .filter( li => li === Object.keys(this.datalookup.userdata.Data.filter(ds => ds.hasOwnProperty(li))[0])[0] );
    }

    console.log('representantes:newupdate');
    console.log(newupdate);

    // se ficou algo para atualizar passa para o data.lookup
    if (newupdate.length > 0) { this.datalookup.updateK1Data(newupdate); }
    this.datalookup.updateK1Data(newupdate);
    */
  }

  ngOnInit() {

  }

  onSelectData(event: any) {

    // console.log('representantes-lookup(onSelectData): ' + JSON.stringify(event));

  }

}
