import { Injectable, Output, EventEmitter } from '@angular/core';
import { CopyClipboardDirective } from '../directive/copy-clipboard.directive';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  @Output() emitAvisos: EventEmitter<any> = new EventEmitter();

  constructor(public toast: ToastrService, public clip: CopyClipboardDirective) {
    this.clip.copied.subscribe(p => {
      this.toast.success('Copiado com sucesso');
    });
   }

  emitSuccess(msg: string, title?: string) {
    this.emitAvisos.emit(
      {
        erro: true,
        warning: false,
        notify: false,
        mensagem: msg
      }
    );
    this.toast.success(msg, title || 'Feito!');
  }

  emitError(msg: string, title?: string) {
    this.emitAvisos.emit(
      {
        erro: true,
        warning: false,
        notify: false,
        mensagem: msg
      }
    );
    this.toast.error(msg, title || 'Eita!');
  }

  emitWarning(msg: string, title?: string) {
    this.emitAvisos.emit(
      {
        erro: false,
        warning: true,
        notify: false,
        mensagem: msg
      }
    );
    this.toast.warning(msg, title || 'Ops!');
  }

  emitNotify(msg: string, title?: string) {
    this.emitAvisos.emit(
      {
        erro: false,
        warning: false,
        notify: true,
        mensagem: msg
      }
    );
    this.toast.info(msg, title || 'Psiu!');
  }

  emitToast() {
    this.toast.show('Teste manual');
  }

}
