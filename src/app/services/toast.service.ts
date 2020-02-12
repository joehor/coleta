import { Injectable, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  constructor(private toast: ToastrService) {}

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
    this.toast.success('Hello world!', 'Toastr fun!');
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
