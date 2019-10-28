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
  dismissible = true;
  timeout = 3000;

  constructor() { }

  ngOnInit() {
  }

}
