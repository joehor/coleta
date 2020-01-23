import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-labelinfo',
  templateUrl: './labelinfo.component.html',
  styleUrls: ['./labelinfo.component.css']
})
export class LabelinfoComponent implements OnInit {

  @Input() title: string;
  @Input() subtitle: string;
  @Input() text: string;
  @Input() perc: number;
  @Input() mainicon: string;
  @Input() mainiconcolor: string;

  constructor() { }

  ngOnInit() {
  }

}
