import { NgModule } from '@angular/core';
import { TokenInterceptor } from './token.interceptor';
import { NotifyService } from '../notify.service';
import { TokenComponent } from './token/token.component';

@NgModule({
  imports: [],
  exports: [TokenInterceptor],
  declarations: [TokenInterceptor, TokenComponent],
  providers: []
})
export class TokenInterceptorModule {
  constructor(private intercept: TokenInterceptor, private notify: NotifyService) {
    this.intercept.emitHTTPError.subscribe(err => {
      if (err.status !== 200) {
        this.notify.emitError(err.status && err.reason || 'Erro não catalogado');
      } else {
        this.notify.emitNotify(err.status);
      }
    });
  }
}
