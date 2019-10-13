import { Component, OnInit } from '@angular/core';
import { RepresentantesLookupService } from '../services/representantes-lookup.service';

@Component({
  selector: 'app-representantes-lookup',
  templateUrl: './representantes-lookup.component.html',
  styleUrls: ['./representantes-lookup.component.css']
})
export class RepresentantesLookupComponent implements OnInit {

  data: any;

  constructor( private repres: RepresentantesLookupService ) { }

  ngOnInit() {

    this.getRepres();

  }

  getRepres() {

    console.log('getRepres: ' + JSON.stringify(this.repres.getData('j', 1, 10)));

    this.repres.getData('j', 1, 10).subscribe(
      data => {
        this.data = data.Data;
      }
    );

  }

}
