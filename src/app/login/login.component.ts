import { Component, OnInit, TemplateRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';
import { LoginService } from '../services/auth/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('template', {static: true}) templateRef: TemplateRef<any>;

  modalRef: BsModalRef;
  formLogin: FormGroup;
  token: any;
  lastLogon = localStorage.getItem('lastLogon');
  loginerror: any;
  // logado = sessionStorage.getItem('userToken') !== '' && sessionStorage.getItem('userToken') !== null;
  logado = this.authservice.isAuthenticated();
  error = false;
  loading = false;

  constructor(
    private modalService: BsModalService,
    private authservice: AuthService,
    private loginservice: LoginService,
    private formbuilder: FormBuilder,
    private route: Router
    // private route: Router
    ) {

      this.modalService.onHide.subscribe(() => {

        console.log('modalclose: usuario autenticado? ' + this.authservice.isAuthenticated());

        if (this.authservice.isAuthenticated()) {

          this.route.navigate(['/dashboard']);

        } else {

          this.route.navigate(['/home']);

        }

      });

    }

  ngOnInit() {
    this.criaForm();
  }

  ngAfterViewInit() {
    const config = {
      backdrop: true,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.templateRef, config );
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
      pss: ['K13928',
              Validators.compose([
                Validators.required,
                Validators.minLength(4)
              ])
          ],
      savepss: [false]
    });
  }

  getToken() {

    this.loading = true;
    // console.log('getToken::');
    // se foi bloqueado pelo auth guard salva a rota para acessar logo que se logar ...
    const redUrl = localStorage.getItem('lockUrl');
    const usuario = this.formLogin.value.usr;
    const senha = this.formLogin.value.pss;
    const salva = this.formLogin.value.savepss;

    // reseta variaveis
    this.error = false;
    this.logado = false;
    this.loginerror = {};

    if (!usuario || !senha) {
      // console.log('usuario: ' + usuario);
      // console.log('senha: ' + senha);
      // console.log('control: ' + JSON.stringify(this.formLogin.controls));
      // this._snackbarService.openSimpleSnack('Necessário informar o login e senha!');
      this.loginerror = {mensagem: 'Necessário informar usuário e senha'};
      this.loading = false;
      this.error = true;
      return;
    }

    // console.log('Dados: ' + usuario + ':' + senha);
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
          this.logado = true;
          this.loading = false;
          // this.route.navigate(['/dashboard']);
        } else {
          console.log('Login Ok ' + redUrl + '!');
          this.logado = true;
          this.loading = false;
          // this.route.navigate([redUrl]);
        }
        this.closeModal();
      },
      error => {
        // envia o dado para quem quiser pegar...
        this.loginerror = error;
        this.logado = false;
        this.loading = false;
        this.error = true;
      });
    }

  openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template);

  }

  closeModal() {

    this.modalRef.hide();

  }

}
