import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class AuthService {
  @Output() emitisLoggin: EventEmitter<any> = new EventEmitter();

  public sendToken(token: string) {

    const localsaved = sessionStorage.setItem('userToken', token);
    this.emitisLoggin.emit(token !== '' && token !== null);
    return localsaved;

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
