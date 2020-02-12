import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ResolveEnd } from '@angular/router';
import { DataLookupService } from '../services/data-lookup.service';
import { DataPostService } from '../services/data-post.service';
import { NotifyService } from '../services/notify.service';
import { CopyClipboardDirective } from '../directive/copy-clipboard.directive';

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
  rotaativa = '/';

  // testes
  step = 0;

  constructor(
    private route: Router,
    private datalookup: DataLookupService,
    private datapost: DataPostService,
    private notify: NotifyService,
    private copydir: CopyClipboardDirective
    ) {

    this.route.events.subscribe(r => {
      if (r instanceof ResolveEnd) {
        this.rotaativa = r.url;
      }
    });

    this.datalookup.emitUpdateStatus
    .subscribe(data => {
      this.loading = {loading: !data.complete, message: data.mensagem};
    } );

    this.datapost.emitDataPost
    .subscribe(data => {
      if (data.error) {
        console.log('datapost.emitDataPost<error>: ' + JSON.stringify(data));
        this.showError(data.mensagem);
      } else {
        console.log('datapost.emitDataPost<success>: ' + JSON.stringify(data));
        this.showSuccess(data.mensagem);
      }
    });

    this.datalookup.emitDataLookup
    .subscribe(data => {
      if (data.error) {
       this.showError(data.mensagem);
      } else {
        this.showSuccess(data.mensagem);
      }
    });

/*     this.copyclip.copied.subscribe(pay => {
      console.log('Copiado com sucesso!');
      this.notify.emitSuccess('Copiado com sucesso!');
    }); */

    this.copydir.copied.subscribe(pay => {
      console.log('Copiado com sucesso!');
      this.notify.emitSuccess('Copiado com sucesso!');
    });

  }

  ngOnInit() {
  }

  slide(event) {
    this.sidemenuopen = event;
    console.log('event: ' + event);
  }

  showError(msg: string) {
    this.error = {error: true, mensagem: msg};
    this.notify.emitError(msg);
  }

  showSuccess(msg: string) {
    this.success = {success: true, mensagem: msg};
    this.notify.emitSuccess(msg);
  }

  showLoading(msg: string) {
    this.loading = {loading: true, message: msg};
    this.notify.emitWarning(msg);
  }

  showModalBasic() {
    // this.modalbasic.openModal(null);
  }

  copyToClipboard(item: string): void {
    const listener = (e: ClipboardEvent) => {
        e.clipboardData.setData('text/plain', (item));
        e.preventDefault();
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  }

  toaster() {
    this.step++;
    if (this.step === 1) { this.notify.emitNotify('notify'); }
    if (this.step === 2) { this.notify.emitWarning('warning'); }
    if (this.step === 3) { this.notify.emitError('error'); }
    if (this.step === 4) { this.notify.emitToast(); }
    if (this.step === 5) { this.step = 0; }
  }

}
