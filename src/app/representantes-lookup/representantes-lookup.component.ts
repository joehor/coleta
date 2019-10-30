import { Component, OnInit } from '@angular/core';
import { GridComponent } from '../componentes/grid/grid.component';

@Component({
  selector: 'app-representantes-lookup',
  templateUrl: './representantes-lookup.component.html',
  styleUrls: ['./representantes-lookup.component.css']
})
export class RepresentantesLookupComponent implements OnInit {

  constructor() {}

  ngOnInit() {

  }

  onSelectData(event: any) {

    console.log('representantes-lookup(onSelectData): ' + JSON.stringify(event));

  }

}
