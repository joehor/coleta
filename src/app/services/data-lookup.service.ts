import { Injectable, Output, EventEmitter, isDevMode } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { DataApi } from './data-api';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface UserData {
  usuario: string;
  Data: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DataLookupService {
  @Output() emitUpdateStatus: EventEmitter<any> = new EventEmitter();
  @Output() emitUpdateComplete: EventEmitter<any> = new EventEmitter();
  @Output() emitDataLookup: EventEmitter<any> = new EventEmitter();

  httperror: any;
  baseapi: string;
  k1data: any;
  userdata: UserData; // json com os datasets do usuário {usuario: 'spr_repres', Data: [{...}]} ...
  localuser: string; // mantém o nome do login ...
  totalUpdates = 0; // mantém o número de metodos a serem chamdos ...
  step = 0; // incrementa a cada execução dos métodos e zera ao salvar no localhost ...
  // lista de atualizações
  k1datalist = []; // mantém a lista de métodos que buscam dados na API ...

  constructor( private httpclient: HttpClient ) {

    this.k1datalist = [
      {
        id: 0,
        property: 'updates',
        updatelist: [],
        stringlog: ''
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
        method: 'getRepresentantes', run: false, error: false, message: '',
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

    // console.log('data-lookup<k1data> ');
    // console.log(JSON.stringify(this.k1data));

    // verifica se existe o userdata ...
    if (this.userdata === null || this.userdata === undefined) {
      this.userdata = this.emptyuser(); // se não existe cria vazio ...
    }

    // console.log('userdata<novo> ');
    // posiciona no usuario correto se houver...
    if (this.k1data.Data.length > 0) {
      if (this.k1data.Data.filter(usu => usu.usuario === this.localuser).length > 0) {
        this.userdata.Data = this.k1data.Data.find(usu => usu.usuario === this.localuser).Data;
        // console.log(this.userdata);
      }
    }

  }  // fim constructor()

  getUserData(ds: string) {
    const data = this.userdata.Data.find(dt => dt.hasOwnProperty(ds));
    let datasource = [];
    if (data) {
      datasource = data[ds];
    } else {
      // aqui preciso colocar um async await
      this.updateK1List([ds]);
    }
    return datasource;
  }

  updateK1List(updatelist: any) {
    // console.log('datalookup<updateK1List>');
    const updlist = this.k1datalist.filter( ul => updatelist.find( li => li === ul.property ) ) || [];

    if (updlist.length > 0) {
      this.updateK1Data(updlist);
    }
  }

  // chama os métodos marcados como run=true
  updateK1Data(updlist: any[]) {

    this.totalUpdates = updlist.length;

    // console.log('datalookup<updlist>');
    // console.log(updlist);
    // console.log('datalookup<k1datalist>');
    // console.log(this.k1datalist);

    const k1upd = this.k1datalist.find(upd => upd.id === 0);

    // log
    k1upd.stringlog = 'userdata<updateK1Data>';

    k1upd.updatelist = updlist;

    // log
    k1upd.stringlog += ' | updlist: ' + updlist;

    // marca todos da lista para atualizar ...
    updlist.map(li => {
      this.k1datalist.find(mtd => mtd.property === li.property).run = true;
      // log
      k1upd.stringlog += ' | ' + li.property + ' | ' + this.k1datalist.find(mtd => mtd.property === li.property).run;
    });

    if (this.k1datalist.filter(nupd => nupd.run).length > 0) {
      // log
      k1upd.stringlog += ' | atualizacoes: ' + this.k1datalist.filter(nupd => nupd.run).length;

      // chama todos as atualizações ...
      this.k1datalist.map(met => { if (met.run) { this.getk1Data(met, false); } });

      // console.log(k1upd.stringlog);
    }

  }

  // cria o usuário vazio ...
  emptyuser() {
    return {usuario: this.localuser, Data: []};
  }

  // emite o status da sincronização ...
  emiteStatus(jsondata: any) {
    this.emitUpdateStatus
      .emit({
        property: jsondata.property,
        step: this.step++,
        stepof: this.totalUpdates,
        error: jsondata.error || false,
        complete: jsondata.complete || false,
        mensagem: jsondata.mensagem
      });
  }

  emitComplete() {
    this.emitUpdateComplete.emit(true);
  }

  // funcçãao que busca todos os datasets solicitados no updatelist ...
  getk1Data(mtd: any, salva: boolean) {

    // console.log('getk1Data() k1datalist: ' + JSON.stringify(this.k1datalist));

    // emite status de inicialização
    this.emiteStatus({
      property: mtd.property,
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
      mtd.run = false;
      mtd.lastupdate = new Date();
      this.emiteStatus({
        property: mtd.property,
        complete: true,
        mensagem: mtd.message
      });
    },
    error => {
      mtd.run = false,
      mtd.error = true;
      mtd.message = error.message;
      // emite o erro ...
      this.emiteStatus({
        property: mtd.property,
        complete: true,
        error: mtd.error,
        mensagem: mtd.message
      });
    },
    // finally ...
    () => {
      mtd.run = false;
      mtd.lastupdate = 'finally';
      this.emiteStatus({
        property: mtd.property,
        complete: true,
        mensagem: mtd.message
      });

      // se for o último método ou foi passado parametro para salvar, salva no localStorage ....
      if (this.k1datalist.filter(ult => ult.run).length === 0) { salva = true; }
      if (salva) { this.salvak1data(); }
    });
  }


  // salva no localhost o k1Data com os datasets do usuário logado ...
  salvak1data() {

    console.log('Salvando atualizações...');
    // limpa a lista de atualizações;
    this.k1datalist.find(upd => upd.id === 0).updatelist = [];

    // prepara o k1data para salvar

    this.k1data = JSON.parse(localStorage.getItem('k1data')) || {Data: []};

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

    const storelog = [];
    if (JSON.parse(localStorage.getItem('k1datalog')) === undefined) {
      storelog.push(JSON.parse(localStorage.getItem('k1datalog')));
    }
    storelog.push(this.k1datalist);
    localStorage.setItem('k1datalist', JSON.stringify(storelog));

    this.step = 0;

    // emite o evento de finalização de todas as buscas ...
    this.emitComplete();
  }

  // busca os dados na API http://servicos.idelli.com.br/GrupoK1/api
  getData(api: string, pesq: string, page: number, pagecnt: number) {

    if (environment.monitor) {
      console.log('Buscando dados...');
    }

    const params = new HttpParams()
      .set('pesquisa', pesq)
      .set('PageNumber', page.toString())
      .set('PageSize', pagecnt.toString());

    /*
    const params = {
      pesquisa: pesq,
      PageNumber: page.toString(),
      PageSize: pagecnt.toString()
    };
    */

    const urlapi = `${this.baseapi}/api/${api}`;


    if (environment.monitor) {
      console.log('baseapi: ' + this.baseapi);
      console.log('urlapi: ' + urlapi);
      console.log('envapi: ' + environment.urlApi);
    }

    if (environment.monitor) {
      // console.log('urlapi: ' + urlapi);
      // console.log('envapi: ' + environment.urlApi);
    }


    // console.log(JSON.stringify(this.httpclient.get(`/api/Authentication`, { params })));

    return this.httpclient
      .get<DataApi>( urlapi, { params } )
      .pipe(
        // retry( 2 ),
        /* catchError( this.handleError ) */
      );

  }

  // Handle API errors
  handleError( error: HttpErrorResponse ) {

    // console.log('httperror: ' + JSON.stringify(error));
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error( 'Ocorreu um erro:', error.message );
    } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Api error code ${error.status}, ` +
          `Erro: ${error.statusText}`);
      }

    return throwError( error );
  }

}
