import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() tipo: string;
  @Input() title: string;
  @Input() mensagem: string;
  @Input() detalhes: any;
  @Input() timeout = 5000;
  @Input() dismissible = true;
  @Input() show = false;

  constructor() { }

  ngOnInit() {
  }

}
