import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  httpError: string;

  constructor( private httpclient: HttpClient ) { }

getToken(usr: string, pss: string) {
    // monta o json para enviar no body do http
    const jsonBody = JSON.stringify({
      User: usr,
      Password: pss
    });

    console.log('Iniciando busca em: "' + environment.urlApi + '"');

    return this.httpclient.post(`/api/Authentication`, jsonBody,
      {headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });

    // .subscribe(
    //  (response) => response,
    //  (error) => this.httpError = error.message
    // );
  }

}
