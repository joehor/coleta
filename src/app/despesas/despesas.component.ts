import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataLookupService } from '../services/data-lookup.service';

@Component({
  selector: 'app-despesas',
  templateUrl: './despesas.component.html',
  styleUrls: ['./despesas.component.css']
})

export class DespesasComponent implements OnInit {

  despdata: any = [];

  constructor( private datalookup: DataLookupService ) {

    this.datalookup.getData('Representantes/Despesas/Lookup', '%', 1, 5)
      .subscribe(data => {
        this.despdata = data;
        const Columns = this.getColumns(this.despdata.Data[0]);
        this.despdata = {...this.despdata, Columns};
      });

  }

  ngOnInit() {
  }

  getColumns(data: any[]) {

    return Object.keys(data);

  }

  isNumber(val: any) {

    return (typeof(val) === 'number');
    // return !isNaN(parseInt(val, 10)) && (typeof(val) === 'number');

  }

  isDate(val: any) {

    // console.log('Original: ' + val);
    // console.log('Typeof: ' + typeof(val));

    if (!this.isNumber(val)) {
      const dateWrapper = new Date(val);
      return !isNaN(dateWrapper.getDate());
    } else {
      return false;
    }

  }

}
