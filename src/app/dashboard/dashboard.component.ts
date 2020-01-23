import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {

    // queria aplicar o fundo somente depois de terminar de renderizar os componentes ...
    // document.documentElement.style.setProperty('--OffLineBackground', 'green');

  }

}
