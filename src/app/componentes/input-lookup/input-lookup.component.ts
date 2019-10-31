import { Component, OnInit, TemplateRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
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

  modalRef: BsModalRef;
  apierror = false;
  pesquisando = false;
  httperror: Httpcodes;

  constructor(private modalService: BsModalService, private datalookup: DataLookupService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('mudou algo');
    if (changes['inputid']) {
      console.log('mudou inputid: ' + this.inputid);
      console.log('mudou lookupselected: ' + JSON.stringify(this.lookupselected));

      // this.getDataFromApi(this.apiroute, this.lookupselected.id.toString(), 1, 10);

    }

  }

  openModal(template: TemplateRef<any>) {

    this.modalRef = this.modalService.show(template);

  }

  // grid dispara esse evento ao selecionar um registro
  onSelectData(event: any) {

    this.lookupselected = event;
    console.log('representantes-lookup(onSelectData): ' + JSON.stringify(event));

  }

  confirm() {

    console.log('Selecionado o item: ' + JSON.stringify(this.lookupselected));
    this.modalRef.hide();

  }

  getDataById(id: number) {
    if (this.inputid !== this.lookupselected.id) {
      this.getDataFromApi(this.apiroute, id.toString(), 1, 10);
    }
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
        } else {
          console.log('Encontrado');
          this.pesquisando = false;
          this.apierror = false;
          this.httperror = null;
          // this.lookupselected = {id: data.Data[Object.keys(data.Data)[0]], descricao: data.Data[Object.keys(data.Data)[1]]};
          data.Data.map((row: Lookup) => {
            this.lookupselected = {id: row.id, descricao: row.descricao};
          });
          this.inputid = this.lookupselected.id;
          this.inputname = this.lookupselected.descricao;
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
}
