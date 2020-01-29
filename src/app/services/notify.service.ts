import { Injectable, Output, EventEmitter } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  @Output() emitAvisos: EventEmitter<any> = new EventEmitter();

  constructor(public toastService: ToastService) { }

  emitError(msg: string) {
    this.emitAvisos.emit(
      {
        erro: true,
        warning: false,
        notify: false,
        mensagem: msg
      }
    );
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

  }

  emitToast() {
    this.toastService.show('fdgffgf');
  }

}
