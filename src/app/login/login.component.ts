import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';
import { LoginService } from '../services/auth/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  token: any;
  lastLogon = localStorage.getItem('lastLogon');
  loginerror: any;

  constructor(
    private authservice: AuthService,
    private loginservice: LoginService,
    private formbuilder: FormBuilder,
    // private route: Router
    ) { }

  ngOnInit() {
    this.criaForm();
  }

  criaForm() {
    this.formLogin = this.formbuilder.group({
      usr: [this.lastLogon || '',
              Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100)
              ])
          ],
      pss: ['',
              Validators.compose([
                Validators.required,
                Validators.minLength(4)
              ])
          ]
    });
  }

  getToken() {
    console.log('getToken::');
    // se foi bloqueado pelo auth guard salva a rota para acessar logo que se logar ...
    const redUrl = localStorage.getItem('lockUrl');
    const usuario = this.formLogin.value.usr;
    const senha = this.formLogin.value.pss;

    if (!usuario || !senha) {
      console.log('usuario: ' + usuario);
      console.log('senha: ' + senha);
      // console.log('control: ' + JSON.stringify(this.formLogin.controls));
      // this._snackbarService.openSimpleSnack('Necessário informar o login e senha!');
      return;
    }

    console.log('Dados: ' + usuario + ':' + senha)
    // aqui

    this.loginservice
    .getToken(usuario, senha)
    // .pipe(first())
    .subscribe(
      token => {
      localStorage.setItem('lastLogon', usuario);
      this.token = token;
      // salvando o token
      console.log('getToken::salvando o token');
      this.authservice.sendToken(this.token.TokenAccess);
      if (!redUrl) {
        console.log('Login Ok dashboard!');
        // this.route.navigate(['/dashboard']);
      } else {
        console.log('Login Ok ' + redUrl + '!');
        // this.route.navigate([redUrl]);
      }
    },
    error => {
      // envia o dado para quem quiser pegar...
      this.loginerror = error;
    });
  }

}
