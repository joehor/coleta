import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js'; // criar um componente para gerar gráficos
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  dashdata: any;
  lineChartData: ChartDataSets[] = [
    { data: [85, 72, 78, 75, 77, 75], label: 'Média geral de Vendas' },
  ];

  lineChartLabels: Label[] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line'; // bar, pie, doughnut, radar, bubble

  constructor() { }

  ngOnInit() {

    this.dashdata = {
      labeltop: [
        {
          title: 'Faturamento',
          subtitle: 'R$ 150.358,32',
          text: 'Atualizado em 22/01/2020',
          perc: 83.50,
          mainicon: 'fa fa-apple',
          mainiconcolor: null
        },
        {
          title: 'Assistências',
          subtitle: 'R$ 13.180,29',
          text: 'Atualizado em 21/01/2020',
          perc: -3.25,
          mainicon: 'fa fa-money',
          mainiconcolor: ''
        },
        {
          title: 'Comissões',
          subtitle: 'R$ 13.970,18',
          text: 'Atualizado em 24/01/2020',
          perc: 2.50,
          mainicon: 'fa fa-coffee',
          mainiconcolor: 'bg-gradient-green'
        }
      ],
      table1: {
        columns: ['id', 'cliente', 'valor'],
        data: [
                { id: 1, cliente: 'ABCDE', valor: 123.98 },
                { id: 2, cliente: 'SDKDJ DKJDK', valor: 4577.12 },
                { id: 3, cliente: 'YTSDN MXNM', valor: 124.78 },
                { id: 4, cliente: 'POIDP DKJ DGHGD', valor: 6325.45 },
                { id: 5, cliente: 'YWETRE SGF DJHLBV', valor: 7841.32 },
                { id: 6, cliente: 'OIOI HDGGD OI HGFA', valor: 9654.12 }
              ]
      }
    };

  }

  ngAfterViewInit() {

    console.log('id : ' + typeof(this.dashdata.table1.data[0].id));
    console.log('cliente : ' + typeof(this.dashdata.table1.data[0].cliente));
    console.log('valor : ' + typeof(this.dashdata.table1.data[0].valor));
    console.log('valor : ' + this.isNumber(5));

    // queria aplicar o fundo somente depois de terminar de renderizar os componentes ...
    // document.documentElement.style.setProperty('--OffLineBackground', 'green');

  }

  isNumber(val: any) {
    return (typeof(val) === 'number');
  }

}
