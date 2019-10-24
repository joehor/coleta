import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  sidemenuopen = false;

  constructor() { }
  ngOnInit() {
  }

  slide(event) {
    this.sidemenuopen = event;
    console.log('event: ' + event);
  }

}
