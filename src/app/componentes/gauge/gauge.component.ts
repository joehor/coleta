import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css']
})
export class GaugeComponent implements OnInit {

  @Input() gperc = 0;
  @Input() gsize = 30;
  @Input() gcolor = 'green';

  constructor() { }

  ngOnInit() {
  }

}
