import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-labelgauge',
  templateUrl: './labelgauge.component.html',
  styleUrls: ['./labelgauge.component.css']
})
export class LabelgaugeComponent implements OnInit {
  @Input() title: string;
  @Input() value: number;
  @Input() color: string;
  @Input() size: number;

  constructor() { }

  ngOnInit() {
    if (!this.color) { this.color = 'stroke: steelblue' }
  }

}
