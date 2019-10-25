import { Injectable, Output, EventEmitter } from '@angular/core';
// import decode from 'jwt-decode';
// import { tokenNotExpired } from 'angular2-jwt';


@Injectable()
export class AuthService {
  @Output() emitisLoggin: EventEmitter<any> = new EventEmitter();

  public sendToken(token: string) {

    this.emitisLoggin.emit(token !== '' && token !== null);
    return sessionStorage.setItem('userToken', token);

  }

  public getToken(): string {

    return sessionStorage.getItem('userToken');

  }

  public logout() {

    console.log('Usuário desconectou-se');
    sessionStorage.removeItem('userToken');
    this.emitisLoggin.emit(false);

  }

  // TODO rever essa parte pois dá erro na função tokenNotExpired ...
  public isAuthenticated(): boolean {
    // get the token
    this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    // return tokenNotExpired(null, token);
    // return JWT(token);
    console.log('AuthService say: userToken is ' + sessionStorage.getItem('userToken'));
    return sessionStorage.getItem('userToken') !== '' && sessionStorage.getItem('userToken') !== null;
  }

}
