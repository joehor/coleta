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

  emitSuccess(msg: string) {
    this.emitAvisos.emit(
      {
        erro: true,
        warning: false,
        notify: false,
        mensagem: msg
      }
    );
    this.toast.success(msg);
  }

  emitError(msg: string) {
    this.emitAvisos.emit(
      {
        erro: true,
        warning: false,
        notify: false,
        mensagem: msg
      }
    );
    this.toast.error(msg, 'Eita!');
  }

  emitWarning(msg: string) {
    this.emitAvisos.emit(
      {
        erro: false,
        warning: true,
        notify: false,
        mensagem: msg
      }
    );
    this.toast.warning(msg);
  }

  emitNotify(msg: string) {
    this.emitAvisos.emit(
      {
        erro: false,
        warning: false,
        notify: true,
        mensagem: msg
      }
    );
    this.toast.info(msg);
  }

  emitToast() {
    this.toast.show('Teste manual');
  }

}
