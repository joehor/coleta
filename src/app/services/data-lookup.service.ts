import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse  } from '@angular/common/http';
import { DataApi } from './data-api';

@Injectable({
  providedIn: 'root'
})
export class DataLookupService {

  constructor( private httpclient: HttpClient, httpparams: HttpParams ) { }

  getData(api: string, pesq: string, page: number, pagecnt: number) {

    let params = new HttpParams();
    params = params.append('pesquisa', pesq);
    params = params.append('PageNumber', page.toString());
    params = params.append('PageSize', pagecnt.toString());

    // console.log(JSON.stringify(this.httpclient.get(`/api/Authentication`, { params })));

    return this.httpclient.get<DataApi>(`/api/${api}`, { params });

  }

}
