import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../../notify.service';
import { TokenInterceptor } from '../token.interceptor';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-token',
  template: '<div>token Works</div>'
})
export class TokenComponent implements OnInit {

  constructor(private intercept: TokenInterceptor, private notify: NotifyService, private auth: AuthService) {
    this.intercept.emitHTTPError.subscribe(err => {
      if (err.status === 401) {
        this.auth.logout();
      } else {
        if (err.status !== 200) {
          this.notify.emitError(err.status && err.reason || 'Erro não catalogado');
        } else {
          this.notify.emitNotify(err.status);
        }
      }
    });
  }

  ngOnInit() {
  }

}
