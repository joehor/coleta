import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { DataApi } from './data-api';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isDevMode } from '@angular/core';

interface UserData {
  usuario: string;
  Data: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DataLookupService {
  @Output() emitUpdateStatus: EventEmitter<any> = new EventEmitter();
  httperror: any;
  baseapi: string;
  k1data: any;
  userdata: UserData; // json com os datasets do usuário {usuario: 'spr_repres', Data: [{...}]} ...
  localuser: string; // mantém o nome do login ...
  totalUpdates = 6; // mantém o número de metodos a serem chamdos ...
  step = 0; // incrementa a cada execução dos métodos e zera ao salvar no localhost ...
  // lista de atualizações
  k1datalist = []; // mantém a lista de métodos que buscam dados na API ...

  constructor( private httpclient: HttpClient ) {

    this.k1datalist = [
      {
        id: 0,
        property: 'updates',
        updatelist: []
      },
      {
        id: 1,
        property: 'menus',
        route: 'representantes/Menus',
        method: 'getMenus', run: false, error: false, message: '',
        lastupdate: ''
      },
      {
        id: 2,
        property: 'empresas',
        route: 'representantes/empresas/lookup',
        method: 'getEmpresas', run: false, error: false, message: '',
        lastupdate: ''
      },
      {
        id: 3,
        property: 'tipospedidos',
        route: 'representantes/tipospedidos/lookup',
        method: 'getTiposPedidos', run: false, error: false, message: '',
        lastupdate: ''
      },
      {
        id: 4,
        property: 'representantes',
        route: 'representantes/lookup',
        method: 'getRepresentantes', run: true, error: false, message: '',
        lastupdate: ''
      },
      {
        id: 5,
        property: 'clientes',
        route: 'representantes/clientes/lookup',
        method: 'getClientes', run: false, error: false, message: '',
        lastupdate: ''
      },
      {
        id: 6,
        property: 'despesaseventos',
        route: 'representantes/DespesasEventos/lookup',
        method: 'getDespesasEventos', run: false, error: false, message: '',
        lastupdate: ''
      }
    ];

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
    if (this.k1data === null || this.k1data === undefined) {
      this.k1data = JSON.parse(localStorage.getItem('k1data'));
    }
    if (this.k1data === null || this.k1data === undefined) {
      this.k1data = {Data: []}; // se não existe cria vazio ...
    }

    console.log('k1data<todos> ');
    console.log(this.k1data);

    // verifica se existe o userdata ...
    if (this.userdata === null || this.userdata === undefined) {
      this.userdata = this.emptyuser(); // se não existe cria vazio ...
    }

    console.log('userdata<novo> ');
    // posiciona no usuario correto se houver...
    if (this.k1data.Data.filter(usu => usu.usuario === this.localuser).length > 0) {
      this.userdata.Data.push(this.k1data.Data.filter(usu => usu.usuario === this.localuser)[0].Data);
      console.log(this.userdata);
    }

  }

  // chama os métodos marcados como run=true
  updateK1Data() {

    console.log('userdata<updateK1Data> ');
    console.log(this.userdata);

    /*
    // dispara todos os métodos marcados como run ...
    this.k1datalist.map(mtd => {
      if (mtd.run) {
        // se existe o método ...
        if (this[mtd.method]) {
          // se ainda não tem a propriedade no objeto k1data
          if (this.k1data.Data.filter(tab => tab.hasOwnProperty(mtd.property)).length === 0) {
            this[mtd.method](false); // o parametro false é para salvar somente no último item da lista...
          }
        }
      }
    });
    */

    // quantas atualizações foram solicitadas ? ...
    const nupdates = this.k1datalist.find(upd => upd.id === 0).updatelist.length;

    this.k1datalist
      .find(upd => upd.id === 0).updatelist // = ['despesaseventos', 'empresas']
      .map(li => { // 'despesaseventos'
        this.k1datalist.map(mtd => { // [{id: 0, property: 'update...}]
          if (mtd.property === li) { // {id: 6, property: 'despesaseventos', route: 'representantes/DespesasEventos/look...}
            mtd.run = true;
            // se bateu com o número de atualizações roda a atualização ...
            if (nupdates === this.k1datalist.filter(nupd => nupd.run).length) {
              this.k1datalist.map(met => { if (met.run) { this.getk1Data(met, false); } });
            }
          }
        });
    });

  }

  // cria o usuário vazio ...
  emptyuser() {
    return {usuario: this.localuser, Data: []};
  }

  // emite o status da sincronização ...
  emiteStatus(jsondata: any) {
    this.emitUpdateStatus
      .emit({
        method: jsondata.method,
        step: this.step++,
        stepof: this.totalUpdates * 2, // pois executa duas vezes para cada metodo
        error: jsondata.error || false,
        complete: jsondata.complete || false,
        mensagem: jsondata.mensagem
      });
  }

  // métodos para busca doas dados ...
  getRepresentantes(salva: boolean) {
    const method = 'Representantes';
    this.getData('representantes/lookup', '%', 1, 10000)
    .subscribe(data => {
      if (this.userdata.Data.filter(ds => ds.hasOwnProperty('representantes')).length > 0 ) {
        this.userdata.Data.find(ds => ds.hasOwnProperty('representantes')).representantes = data.Data;
      } else {
        this.userdata.Data.push({representantes: data.Data});
      }
      // emite status de inicialização
      this.emiteStatus({
        method: 'get' + method,
        mensagem: 'Atualizando ' + method
      });
      // se for o último método ou foi passado parametro para salvar, salva no localstorage ....
      if (this.step === this.k1datalist.filter(mtd => mtd.run).length) { salva = true; }
      if (salva) { this.salvak1data(); }
    },
    error => {
      this.k1datalist.map(mtd => {
        if (mtd.method === 'get' + method) {
          mtd.run = false,
          mtd.error = true;
          mtd.message = error.message;
          this.emiteStatus({
            method: 'get' + method,
            complete: mtd.run,
            error: true,
            mensagem: error.message
          });
        }});
    },
    () => {
      this.k1datalist.map(mtd => {
        if (mtd.method === 'get' + method) {
          mtd.run = false,
          mtd.error = false,
          mtd.message = 'Atualizado com sucesso';
          this.emiteStatus({
            method: 'get' + method,
            complete: mtd.run,
            mensagem: mtd.message
          });
        }});
      }
    );
  }
  getClientes(salva: boolean) {
    const method = 'Clientes';
    this.getData('representantes/clientes/lookup', '%', 1, 10000)
    .subscribe(data => {
      this.userdata.Data.push({clientes: data.Data});
      // emite status de inicialização
      this.emiteStatus({
        method: 'get' + method,
        mensagem: 'Atualizando ' + method
      });
      // se for o último método ou foi passado parametro para salvar, salva no localstorage ....
      if (this.step === this.k1datalist.filter(mtd => mtd.run).length) { salva = true; }
      if (salva) { this.salvak1data(); }
    },
    error => {
      this.k1datalist.map(mtd => {
        if (mtd.method === 'get' + method) {
          mtd.run = false,
          mtd.error = true,
          mtd.message = error.message;
          this.emiteStatus({
            method: 'get' + method,
            complete: mtd.run,
            error: true,
            mensagem: error.message
          });
        }});
    },
    () => {
      this.k1datalist.map(mtd => {
        if (mtd.method === 'get' + method) {
          mtd.run = false,
          mtd.error = false,
          mtd.message = 'Atualizado com sucesso';
          this.emiteStatus({
            method: 'get' + method,
            complete: mtd.run,
            mensagem: mtd.message
          });
        }});
      }
    );
  }
  getEmpresas(salva: boolean) {
    const method = 'Empresas';
    this.getData('representantes/empresas/lookup', '%', 1, 10000)
    .subscribe(data => {
      this.userdata.Data.push({empresas: data.Data});
      // emite status de inicialização
      this.emiteStatus({
        method: 'get' + method,
        mensagem: 'Atualizando ' + method
      });
      // se for o último método ou foi passado parametro para salvar, salva no localstorage ....
      if (this.step === this.k1datalist.filter(mtd => mtd.run).length) { salva = true; }
      if (salva) { this.salvak1data(); }
    },
    error => {
      this.k1datalist.map(mtd => {
        if (mtd.method === 'get' + method) {
          mtd.run = false,
          mtd.error = true,
          mtd.message = error.message;
          this.emiteStatus({
            method: 'get' + method,
            complete: mtd.run,
            error: true,
            mensagem: error.message
          });
        }});
    },
    () => {
      this.k1datalist.map(mtd => {
        if (mtd.method === 'get' + method) {
          mtd.run = false,
          mtd.error = false,
          mtd.message = 'Atualizado com sucesso';
          this.emiteStatus({
            method: 'get' + method,
            complete: mtd.run,
            mensagem: mtd.message
          });
        }});
      }
    );
  }
  getTiposPedidos(salva: boolean) {
    const method = 'TiposPedidos';
    this.getData('representantes/tipospedidos/lookup', '%', 1, 10000)
    .subscribe(data => {
      this.userdata.Data.push({tipospedidos: data.Data});
      // emite status de inicialização
      this.emiteStatus({
        method: 'get' + method,
        mensagem: 'Atualizando ' + method
      });
      // se for o último método ou foi passado parametro para salvar, salva no localstorage ....
      if (this.step === this.k1datalist.filter(mtd => mtd.run).length) { salva = true; }
      if (salva) { this.salvak1data(); }
    },
    error => {
      this.k1datalist.map(mtd => {
        if (mtd.method === 'get' + method) {
          mtd.run = false,
          mtd.error = true,
          mtd.message = error.message;
          this.emiteStatus({
            method: 'get' + method,
            complete: mtd.run,
            error: true,
            mensagem: error.message
          });
        }});
    },
    () => {
      this.k1datalist.map(mtd => {
        if (mtd.method === 'get' + method) {
          mtd.run = false,
          mtd.error = false,
          mtd.message = 'Atualizado com sucesso';
          this.emiteStatus({
            method: 'get' + method,
            complete: mtd.run,
            mensagem: mtd.message
          });
        }});
      }
    );
  }
  getDespesasEventos(salva: boolean) {
    const method = 'DespesasEventos';
    this.getData('representantes/DespesasEventos/lookup', '%', 1, 10000)
      .subscribe(data => {
        if (this.userdata.Data.filter(ds => ds.hasOwnProperty('despesaseventos')).length > 0 ) {
          this.userdata.Data.find(ds => ds.hasOwnProperty('despesaseventos')).despesaseventos = data.Data;
        } else {
          this.userdata.Data.push({despesaseventos: data.Data});
        }
          // emite status de inicialização
        this.emiteStatus({
          method: 'get' + method,
          mensagem: 'Atualizando ' + method
        });
        // se for o último método ou foi passado parametro para salvar, salva no localstorage ....
        if (this.step === this.k1datalist.filter(mtd => mtd.run).length) { salva = true; }
        if (salva) { this.salvak1data(); }
      },
      error => {
        this.k1datalist.map(mtd => {
          if (mtd.method === 'get' + method) {
            mtd.run = false,
            mtd.error = true,
            mtd.message = error.message;
            this.emiteStatus({
              method: 'get' + method,
              complete: mtd.run,
              error: true,
              mensagem: error.message
            });
          }});
      },
      () => {
        this.k1datalist.map(mtd => {
          if (mtd.method === 'get' + method) {
            mtd.run = false,
            mtd.error = false,
            mtd.message = 'Atualizado com sucesso';
            this.emiteStatus({
              method: 'get' + method,
              complete: mtd.run,
              mensagem: mtd.message
            });
          }});
        }
      );
  }
  getMenus(salva: boolean) {
    const method = 'Menus';
    this.getData('representantes/Menus', '%', 1, 10000)
    .subscribe(data => {
      if (!this.userdata.Data.hasOwnProperty('menus')) {
        this.userdata.Data.push({menus: data.Data});
      } else {
        this.userdata.Data['menus'] = data.Data;
      }
      // emite status de inicialização
      this.emiteStatus({
        method: 'get' + method,
        mensagem: 'Atualizando ' + method
      });
      // se for o último método ou foi passado parametro para salvar, salva no localstorage ....
      if (this.step === this.k1datalist.filter(mtd => mtd.run).length) { salva = true; }
      if (salva) { this.salvak1data(); }
    },
    error => {
      this.k1datalist.map(mtd => {
        if (mtd.method === 'get' + method) {
          mtd.run = false,
          mtd.error = true,
          mtd.message = error.message;
          this.emiteStatus({
            method: 'get' + method,
            complete: mtd.run,
            error: true,
            mensagem: error.message
          });
        }});
    },
    () => {
      this.k1datalist.map(mtd => {
        if (mtd.method === 'get' + method) {
          mtd.run = false,
          mtd.error = false,
          mtd.message = 'Atualizado com sucesso';
          this.emiteStatus({
            method: 'get' + method,
            complete: mtd.run,
            mensagem: mtd.message
          });
        }});
      }
    );
  }

  // generic getdata
  getk1Data(mtd: any, salva: boolean) {

    // emite status de inicialização
    this.emiteStatus({
      method: 'get' + mtd.property,
      mensagem: 'Atualizando ' + mtd.property
    });

    this.getData(mtd.route, '%', 1, 10000)
    .subscribe(data => {
      if (this.userdata.Data.filter(ds => ds.hasOwnProperty(mtd.property)).length > 0 ) {
        this.userdata.Data.find(ds => ds.hasOwnProperty(mtd.property))[mtd.property] = data.Data;
      } else {
        this.userdata.Data.push({[mtd.property]: data.Data});
      }
      mtd.message = 'Atualizado com sucesso';
    },
    error => {
      mtd.run = false,
      mtd.error = true;
      mtd.message = error.message;
      // emite o erro ...
      this.emiteStatus({
        method: 'get' + mtd.property,
        complete: true,
        error: mtd.error,
        mensagem: mtd.message
      });
    },
    // finally ...
    () => {
      mtd.run = false,
      this.emiteStatus({
        method: 'get' + mtd.property,
        complete: true,
        mensagem: mtd.message
      });

      // se for o último método ou foi passado parametro para salvar, salva no localStorage ....
      // if (this.step === this.k1datalist.filter(mtd => mtd.run).length) { salva = true; }
      if (salva) { this.salvak1data(); }
    });
  }


  // salva no localhost o k1Data com os datasets do usuário logado ...
  salvak1data() {

    // prepara o k1data para salvar
    if (this.k1data === null || this.k1data === undefined) {
      this.k1data = JSON.parse(localStorage.getItem('k1data'));
    }
    if (this.k1data === null || this.k1data === undefined) {
      this.k1data = {Data: []}; // se não existe cria vazio ...
    }

    // remonta o k1data com os dados do usuário logado ...
    this.k1data.Data.map( user => {
      if (user.usuario === this.localuser) {
        user.Data = this.userdata.Data; // joga os dados locais para o k1data no usuario correto ...
      }
    });
    if (this.k1data.Data.filter(user => user.usuario === this.localuser).length === 0) {
      this.k1data.Data.push(this.userdata);
    }

    const newdata = JSON.stringify(this.k1data);
    localStorage.setItem('k1data', newdata);
    console.log('salvak1data');
    console.log(this.k1data);
    console.log(this.userdata);
    this.step = 0;

  }

  // busca os dados na API http://servicos.idelli.com.br/GrupoK1/api
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
