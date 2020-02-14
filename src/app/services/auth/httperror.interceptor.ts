import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { NotifyService } from '../../services/notify.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  httplisterror: any[] = [
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


  constructor(private notify: NotifyService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request)
        .pipe(
            retry(1),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage = `Error: ${error.error.message}`;
                } else {
                    // server-side error
                    const traducao = this.httplisterror.filter(f => f.code === error.status);
                    // console.log(traducao);
                    if (traducao) {
                      /* errorMessage = `${traducao[0].code}-${traducao[0].mensagem}<br><a style="cursor:pointer" [routerLink]="['/error']">Saber mais</a>`; */
                      errorMessage = `${traducao[0].code}-${traducao[0].mensagem}`;
                    } else {
                      errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
                    }
                }
                // console.log(errorMessage);
                this.notify.emitError(errorMessage);
                return throwError(errorMessage);
            })
        );
  }
}
