import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { DataApi } from './data-api';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataLookupService {
  @Output() emitUpdateStatus: EventEmitter<any> = new EventEmitter();
  httperror: any;
  baseapi: string;
  k1data: any;
  userdata: any;
  localuser: string;
  totalUpdates = 6;
  step = 0;
  // lista de atualizações
  k1datalist = [
    {id: 1, property: 'empresas', method: 'getEmpresas'},
    {id: 2, property: 'tipospedidos', method: 'getTiposPedidos'},
    {id: 3, property: 'representantes', method: 'getRepresentantes'},
    {id: 4, property: 'clientes', method: 'getClientes'},
    {id: 5, property: 'despesaseventos', method: 'getDespesasEventos'}
  ];

  constructor( private httpclient: HttpClient ) {
    // usando o ng build --configuration=production dá o erro:
    // tslint:disable-next-line: max-line-length
    // ERROR in : Can't resolve all parameters for HttpParams in C:/Developer/Angular/Coleta/node_modules/@angular/common/http/http.d.ts: (?).
    if (isDevMode()) {
      this.baseapi = '';
    } else {
      this.baseapi = 'http://servicos.idelli.com.br/GrupoK1/api';
    }

    // prepara o k1data que contém todos os datasets necessários ...
    this.localuser = localStorage.getItem('lastLogon');
    this.k1data = JSON.parse(localStorage.getItem('k1data'));

    // se salvou o k1data, verifica se tem os dados para o usuário que se logou ...
    if (this.k1data !== null) {
      if (this.k1data.usuario.toUpperCase() !== this.localuser.toUpperCase()) {
        this.k1data = this.emptyuser();
      }
    } else {
      this.k1data = this.emptyuser();
    }

    console.log('k1data: ');
    console.log(this.k1data);
  }

  updateK1Data() {

    // roda todas as chamadas ...
    this.k1datalist.map(element => {
      // se existe o método ...
      if (this[element.method]) {
        // se ainda não tem a propriedade no objeto k1data
        if (this.k1data.Data.filter(tab => tab.hasOwnProperty(element.property)).length === 0) {
          this[element.method](false); // o parametro false é para salvar somente no último item da lista...
        }
      }
    });

  }

  emptyuser() {
    return {usuario: this.localuser, Data: []};
  }
  getRepresentantes(salva: boolean) {
    this.getData('representantes/lookup', '%', 1, 10000)
      .subscribe(data => {
        this.k1data.Data.push({representantes: data.Data});
        this.emitUpdateStatus.emit({mensagem: 'Atualizando lista de Representantes', step: this.step++, stepof: this.totalUpdates});
        // se for o último método ou foi passado parametro para salvar, salva no localstorage ....
        if (this.step === this.k1datalist.length) { salva = true; }
        if (salva) { this.salvak1data(); }
      });
  }
  getClientes(salva: boolean) {
    this.getData('representantes/clientes/lookup', '%', 1, 10000)
      .subscribe(data => {
        this.k1data.Data.push({clientes: data.Data});
        this.emitUpdateStatus.emit({mensagem: 'Atualizando lista de clientes', step: this.step++, stepof: this.totalUpdates});
        // se for o último método ou foi passado parametro para salvar, salva no localstorage ....
        if (this.step === this.k1datalist.length) { salva = true; }
        if (salva) { this.salvak1data(); }
      });
  }
  getEmpresas(salva: boolean) {
    this.getData('representantes/empresas/lookup', '%', 1, 10000)
      .subscribe(data => {
        this.k1data.Data.push({empresas: data.Data});
        this.emitUpdateStatus.emit({mensagem: 'Atualizando lista de empresas', step: this.step++, stepof: this.totalUpdates});
        // se for o último método ou foi passado parametro para salvar, salva no localstorage ....
        if (this.step === this.k1datalist.length) { salva = true; }
        if (salva) { this.salvak1data(); }
      });
  }
  getTiposPedidos(salva: boolean) {
    this.getData('representantes/tipospedidos/lookup', '%', 1, 10000)
      .subscribe(data => {
        this.k1data.Data.push({tipospedidos: data.Data});
        this.emitUpdateStatus.emit({mensagem: 'Atualizando lista de Tipos de Pedidos', step: this.step++, stepof: this.totalUpdates});
        // se for o último método ou foi passado parametro para salvar, salva no localstorage ....
        if (this.step === this.k1datalist.length) { salva = true; }
        if (salva) { this.salvak1data(); }
      });
  }
  getDespesasEventos(salva: boolean) {
    this.getData('representantes/DespesasEventos/lookup', '%', 1, 10000)
      .subscribe(data => {
        this.k1data.Data.push({despesaseventos: data.Data});
        this.emitUpdateStatus.emit({mensagem: 'Atualizando lista de Eventos', step: this.step++, stepof: this.totalUpdates});
        // se for o último método ou foi passado parametro para salvar, salva no localstorage ....
        if (this.step === this.k1datalist.length) { salva = true; }
        if (salva) { this.salvak1data(); }
      });
  }

  salvak1data() {

    const storedata = JSON.stringify(this.k1data);
    localStorage.setItem('k1data', storedata);

  }

  getData(api: string, pesq: string, page: number, pagecnt: number) {

    if (environment.monitor) {
      console.log('Buscando dados...');
    }

    const params = {
      pesquisa: pesq,
      PageNumber: page.toString(),
      PageSize: pagecnt.toString()
    };

    const urlapi = `${this.baseapi}/api/${api}`;

    if (environment.monitor) {
      // console.log('urlapi: ' + urlapi);
      // console.log('envapi: ' + environment.urlApi);
    }


    // console.log(JSON.stringify(this.httpclient.get(`/api/Authentication`, { params })));

    return this.httpclient
      .get<DataApi>( urlapi, { params } )
      .pipe(
        // retry( 2 ),
        catchError( this.handleError )
      );

  }

  // Handle API errors
  handleError( error: HttpErrorResponse ) {

    const httplisterror: any[] = [
      {code: 100, erro: 'Continue', mensagem:  'Continuar'},
      {code: 101, erro: 'Switching Protocols', mensagem: 'Mudando Protocolos'},
      {code: 102, erro: 'Processing', mensagem: 'Processando'},
      {code: 200, erro: 'Ok', mensagem: 'Ok'},
      {code: 201, erro: 'Created', mensagem: 'Criado'},
      {code: 202, erro: 'Accepted', mensagem: 'Aceito'},
      {code: 203, erro: 'Non-Authoritative Information', mensagem: 'Não autorizado'},
      {code: 204, erro: 'No Content', mensagem: 'Nenhum Conteúdo'},
      {code: 205, erro: 'Reset Content', mensagem: 'Resetar Conteúdo'},
      {code: 206, erro: 'Partial Content', mensagem: 'Conteúdo Parcial'},
      {code: 300, erro: 'Multiple Choices', mensagem: 'Múltipla Escolha'},
      {code: 301, erro: 'Moved Permanently', mensagem: 'Movido Permanentemente'},
      {code: 302, erro: 'Found', mensagem: 'Encontrado'},
      {code: 303, erro: 'See Other', mensagem: 'Veja outro'},
      {code: 304, erro: 'Not Modified', mensagem: 'Não modificado'},
      {code: 305, erro: 'Use Proxy', mensagem: 'Use Proxy'},
      {code: 306, erro: 'Proxy Switch', mensagem: 'Proxy Trocado'},
      {code: 400, erro: 'Bad Request', mensagem: 'Solicitação Inválida'},
      {code: 401, erro: 'Unauthorized', mensagem: 'Acesso restrito ou usuário não autenticado'},
      {code: 402, erro: 'Payment Required', mensagem: 'Pagamento necessário'},
      {code: 403, erro: 'Forbidden', mensagem: 'Proibido'},
      {code: 404, erro: 'Not Found', mensagem: 'Página ou recurso não encontrado'},
      {code: 405, erro: 'Method Not Allowed', mensagem: 'Método não permitido'},
      {code: 406, erro: 'Not Acceptable', mensagem: 'Não aceito'},
      {code: 407, erro: 'Proxy Authentication Required', mensagem: 'Autenticação de Proxy Necessária'},
      {code: 408, erro: 'Request Time-out', mensagem: 'Tempo de solicitação esgotado'},
      {code: 409, erro: 'Conflict', mensagem: 'Conflito'},
      {code: 410, erro: 'Gone', mensagem: 'Perdido'},
      {code: 411, erro: 'Length Required', mensagem: 'Duração necessária'},
      {code: 412, erro: 'Precondition Failed', mensagem: 'Falha de pré-condição'},
      {code: 413, erro: 'Request Entity Too Large', mensagem: 'Solicitação da entidade muito extensa'},
      {code: 414, erro: 'Request-URL Too Large', mensagem: 'Solicitação de URL muito Longa'},
      {code: 415, erro: 'Unsupported Media Type', mensagem: 'Tipo de mídia não suportado'},
      {code: 416, erro: 'Request Range Not Satisfiable', mensagem: 'Solicitação de faixa não satisfatória'},
      {code: 417, erro: 'Expectation Failed', mensagem: 'Falha na expectativa'},
      {code: 500, erro: 'Internal Server Error', mensagem: 'Erro do Servidor Interno'},
      {code: 501, erro: 'Not Implemented', mensagem: 'Não implementado'},
      {code: 502, erro: 'Bad Gateway', mensagem: 'Porta de entrada ruim'},
      {code: 503, erro: 'Service Unavailable', mensagem: 'Serviço Indisponível'},
      {code: 504, erro: 'Gateway Time-out', mensagem: 'Tempo limite da Porta de Entrada'},
      {code: 505, erro: 'HTTP Version Not Supported', mensagem: 'Versão HTTP não suportada'}
    ];

    // console.log('httperror: ' + JSON.stringify(error));
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error( 'An error occurred:', error.message );
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.statusText}`);
      }

    // return an observable with a user-facing error message
    // 'Something bad happened; please try again later.'
    // console.log('datalookup: ' + error.statusText);
    // console.log('this.httplisterror: ' + JSON.stringify(this.httplisterror));

    // console.log('Apierror!');

    let apiret = httplisterror.filter( err => (err.code === error.status) )[0];

    // console.log('Apierror depois!');

    // console.log('apiret: ' + JSON.stringify(apiret));
    // console.log(apiret.mensagem);

    if (!apiret) { apiret = {code: error.statusText, erro: error.message, mensagem: error.message}; }

    return throwError( apiret );
  }

}
