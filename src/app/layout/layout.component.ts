import { Component, OnInit } from '@angular/core';
import { DataLookupService } from '../services/data-lookup.service';
import { DataPostService } from '../services/data-post.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  sidemenuopen = false;
  error: any = {error: false};
  success: any = {succes: false};
  loading: any = {loading: false};

  constructor(private datalookup: DataLookupService, private datapost: DataPostService) {
    this.datalookup.emitUpdateStatus
    .subscribe(data => {
      this.loading = {loading: !data.complete, message: data.mensagem};
    } );

    this.datapost.emitDataPost
    .subscribe(data => {
      if (data.error) {
       this.showError(data.mensagem);
      } else {
        this.showSuccess(data.mensagem);
      }
    } );
  }

  ngOnInit() {
  }

  slide(event) {
    this.sidemenuopen = event;
    console.log('event: ' + event);
  }

  showError(msg: string) {
    this.error = {error: true, mensagem: msg};
  }

  showSuccess(msg: string) {
    this.success = {success: true, mensagem: msg};
  }

  showLoading(msg: string) {
    this.loading = {loading: true, message: msg};
  }

}
