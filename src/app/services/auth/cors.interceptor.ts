
/* NÃO ESTÁ SENDO USADO */

import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CORSInterceptor implements HttpInterceptor {
  @Output() emitHTTPError: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('Entrou no CORSInterceptor');

    request = request.clone({
      setHeaders: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
      }
    });

    return next.handle(request)
     .pipe(
      // retry(2),
      catchError((error: HttpErrorResponse) => {
        let data = {};
        data = {
            reason: error && error.error && error.error.reason ? error.error.reason : '',
            status: error.status
        };
        console.log(data);
        this.emitHTTPError.emit(data);
        return throwError(error);
      })
    );
  }
}
