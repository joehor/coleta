import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.css']
})
export class GaugeComponent implements OnInit, OnChanges {
  @Input() value: number;
  @Input() color: string;
  @Input() size: number;
  radius = 54;
  circumference = 2 * Math.PI * this.radius;
  dashoffset: number;
  percpos: number;

  constructor() {
    document.documentElement.style.setProperty('--dashstart', this.circumference.toString());
    this.progress(0);
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value.currentValue !== changes.value.previousValue) {
      this.progress(changes.value.currentValue);
    }
  }

  private progress(value: number) {
    const progress = value / 100;

    this.percpos = (5  - value.toString().length) * 10;

    document.documentElement.style.setProperty('--dashend', (this.circumference * (1 - progress)).toString());

    this.dashoffset = this.circumference * (1 - progress);
    console.log('dashoffset: ' + this.dashoffset);
  }
}
