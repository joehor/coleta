import { Component, OnInit } from '@angular/core';
import { DataLookupService } from '../services/data-lookup.service';

@Component({
  selector: 'app-representantes-lookup',
  templateUrl: './representantes-lookup.component.html',
  styleUrls: ['./representantes-lookup.component.css']
})
export class RepresentantesLookupComponent implements OnInit {
  datalookup: any;

  constructor( private data: DataLookupService ) {
    this.datalookup = this.data.userdata.filter(dt => dt.hasOwnProperty('representantes'));
    console.log(this.datalookup);
  }

  ngOnInit() {

  }

  onSelectData(event: any) {

    console.log('representantes-lookup(onSelectData): ' + JSON.stringify(event));

  }

}
