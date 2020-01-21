import { Component, OnInit } from '@angular/core';
import { DataLookupService } from '../services/data-lookup.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  sidemenuopen = false;
  error: any;
  success: any;
  loading: boolean;
  loadmessage: boolean;

  constructor(private datalookup: DataLookupService) {
    this.datalookup.emitUpdateStatus
    .subscribe(data => {
      this.loading = !data.complete;
      this.loadmessage = data.mensagem;
    } );
  }

  ngOnInit() {
  }

  slide(event) {
    this.sidemenuopen = event;
    console.log('event: ' + event);
  }

  showError(msg: string) {
    this.error = {mensagem: msg};
  }

  showSuccess(msg: string) {
    this.success = {mensagem: msg};
  }

}
