import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
// import { Httpcodes } from './httpcodes';
import { environment } from '../../environments/environment';
import { isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataPostService {
  @Output() emitDataPost: EventEmitter<any> = new EventEmitter();

  httperror: any;
  baseapi: string;

  constructor( private httpclient: HttpClient ) {

    if (isDevMode()) {
      this.baseapi = '';
    } else {
      this.baseapi = 'http://servicos.idelli.com.br/GrupoK1/api';
    }
  }

  updateData(api: string, data: any) {

    if (environment.monitor) {
      console.log('Atualizando dados...');
    }

    const urlapi = `${this.baseapi}/api/${api}`;

    if (environment.monitor) {
      console.log('baseapi: ' + this.baseapi);
      console.log('urlapi: ' + urlapi);
      console.log('envapi: ' + environment.urlApi);
      console.log('data: ' + JSON.stringify(data));
    }

    // console.log(JSON.stringify(this.httpclient.get(`/api/Authentication`, { params })));

    if (environment.monitor) { console.log('datapost:: antes de salvar'); }

    return this.httpclient
    .post<any>( urlapi, data )
    .pipe(
      // retry(2),
      /* catchError( this.handleError ) */
    );

  }

  // Handle API errors
  handleError( error: HttpErrorResponse ) {

    // console.log('httperror: ' + JSON.stringify(error));
    if (error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error( 'An error occurred:', error.message );
      this.emitDataPost.emit({error: true, mensagem: error.message});
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.statusText}`);
    }

    return throwError( error );
  }

}
