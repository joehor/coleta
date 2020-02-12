import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotifyService } from '../../services/notify.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  @Output() emitHTTPError: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private notify: NotifyService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('Entrou no TokenInterceptor');

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });

    return next.handle(request)
     .pipe(
      // retry(2),
      catchError((error: HttpErrorResponse) => {
        let data = {};
        data = {
            reason: error && error.error && error.error.reason ? error.error.reason : '',
            status: error.status,
            statusText: error.statusText
        };
        console.log(data);

/*           if (h.status !== 200) {
            this.notify.emitError(h.statusText);
          } else {
            this.notify.emitSuccess('OK!');
          }
 */
        this.emitHTTPError.emit(error);
        return throwError(error);
      })
    );
  }
}
/*
@Injectable()
class ErrorInterceptor implements HttpInterceptor {
   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).catch(err => {
      if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
             // JWT expired, go to login
          }
        }
    });
  }
}*/

