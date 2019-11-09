import { Component, OnInit, TemplateRef, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { DataLookupService } from '../../services/data-lookup.service';

interface Httpcodes {
  code: number;
  erro: string;
  mensagem: string;
}

interface Lookup {
  id: number;
  descricao: string;
}

@Component({
  selector: 'app-input-lookup',
  templateUrl: './input-lookup.component.html',
  styleUrls: ['./input-lookup.component.css']
})

export class InputLookupComponent implements OnInit, OnChanges {
  @Input() apiroute: string;
  @Input() inputid: number;
  @Input() inputname: string;
  @Input() title = 'Não Informado';
  @Input() pagesize = 10;
  @Input() lookupselected: Lookup = {id: 0, descricao: ''};
  @Input() apidata: any[] = [];
  @Output() inputModelChange = new EventEmitter<number>();
  searchDataCtrl = new FormControl();
  waitsearch: any;

  modalRef: BsModalRef;
  apierror = false;
  pesquisando = false;
  httperror: Httpcodes = { code: 0, erro: '', mensagem: ''};

  constructor(private modalService: BsModalService, private datalookup: DataLookupService, private http: HttpClient) { }

  ngOnInit() {

    // busca todos os eventos ...
    if (this.apiroute) { this.getDataFromApi(this.apiroute, '%', 1, 1000); }

  }


  ngOnChanges(changes: SimpleChanges) {

    console.log('mudou algo');
    if (changes[this.inputid]) {
      console.log('mudou inputid: ' + this.inputid);
      // console.log('mudou lookupselected: ' + JSON.stringify(this.lookupselected));

      // this.getDataFromApi(this.apiroute, this.lookupselected.id.toString(), 1, 10);

      this.inputid = this.lookupselected.id;

    }

  }

  openModal(template: TemplateRef<any>) {

    const config = {
      backdrop: true,
      ignoreBackdropClick: true
    };

    this.modalRef = this.modalService.show(template, config);

  }

  // grid dispara esse evento ao selecionar um registro
  onSelectData(event: any) {

    this.lookupselected = event.item;
    console.log('representantes-lookup(onSelectData): ' + JSON.stringify(event));
    this.inputid = this.lookupselected.id;
    // emite o evento para os outros componentes ...
    this.inputModelChange.emit(this.inputid);

  }

  confirm() {

    console.log('Selecionado o item: ' + JSON.stringify(this.lookupselected));
    this.modalRef.hide();

  }

  findById() {

    this.lookupselected = this.apidata.find(ds => ds.id === this.inputid.toString());
    if (this.lookupselected !== undefined) {
      this.inputname = this.lookupselected.descricao;
    } else {
      this.inputname = '';
    }
    // this.inputModelChange.emit(this.inputid);
  }

  getDataById(id: number) {

    if (this.inputid !== this.lookupselected.id) {
      this.getDataFromApi(this.apiroute, id.toString(), 1, 10);
    }

  }

  onKeySearch() {

    clearTimeout(this.waitsearch);
    this.waitsearch = setTimeout(() => {
      this.getDataByName(this.inputname);
    }, 1000);

  }

  getDataByName(search: any) {

    this.getDataFromApi(this.apiroute, search, 1, 1000);

  }

  // serviço que busca os dados da API...
  getDataFromApi(api: string, pesq: string, page: number, pagecount: number) {

    this.pesquisando = true;
    this.datalookup.getData(api, pesq, page, pagecount)
      .subscribe(
      data => {
        if (!data.Data) {
          console.log('Não encontrado!');
          this.pesquisando = false;
          this.inputid = 0;
          this.apidata = [];
        } else {
          console.log('Encontrado');
          this.pesquisando = false;
          this.apierror = false;
          this.httperror = null;
          this.apidata = data.Data;
          // this.lookupselected = {id: data.Data[Object.keys(data.Data)[0]], descricao: data.Data[Object.keys(data.Data)[1]]};
          data.Data.map((row: Lookup) => {
            this.lookupselected = {id: row.id, descricao: row.descricao};
          });
          this.datalistSelected();
          // this.confirm();
        }
      },
      error => {
        this.pesquisando = false;
        this.inputid = 0;
        this.apierror = true;
        this.httperror = error;
        if (error.code === 401) { this.httperror.mensagem = 'Falha na autenticação, efetue novo logon'; }
      }
    );
  }

  datalistSelected() {

    this.inputid = this.lookupselected.id;
    this.inputname = this.lookupselected.descricao;

  }

  lista() {

    return this.apidata.map(desc => desc.descricao);

  }
}
