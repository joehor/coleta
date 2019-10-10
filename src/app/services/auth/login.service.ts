import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
// import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( private httpclient: HttpClient ) { }

getToken(usr: string, pss: string) {
    // monta o json para enviar no body do http
    const jsonBody = JSON.stringify({
      username: usr,
      userpass: pss
    });

    console.log('Iniciando busca em: "' + environment.urlApi + '"');

    return this.httpclient.post(`${environment.urlApi}/Authentication`, jsonBody,
      {headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
    // .pipe(
    //   retry(1),
    //   catchError(this.handleError)
    // );
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // window.alert(errorMessage);
    console.log(`login.service: ${errorMessage}`);
    return throwError(errorMessage);
  }

}
