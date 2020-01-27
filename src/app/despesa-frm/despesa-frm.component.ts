import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataPostService } from '../services/data-post.service';
import { DataLookupService } from '../services/data-lookup.service';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-despesa-frm',
  templateUrl: './despesa-frm.component.html',
  styleUrls: ['./despesa-frm.component.css']
})
export class DespesaFrmComponent implements OnInit {

  // TODO(kara):  Replace ngModel with reactive API
  // tslint:disable-next-line: no-input-rename
  @Input('ngModel') model: any;

  formDespesa: FormGroup;
  // form inputs
  frmDados: any = {
    id: 0,
    idRepres: 0,
    idEvento: 0,
    Data_Saida: '',
    Data_Retorno: '',
    Roteiro: '',
    Observacoes: '',
    UsuarioAssociado: ''
  };

  SaidaRetorno: any;
  lookRepres: string;
  lookEvento: string;

  updatelist: any[] = ['representantes', 'despesaseventos'];
  representantes: any[] = [];
  despesaseventos: any[] = [];

  constructor(
    private formbuilder: FormBuilder,
    private datapost: DataPostService,
    private datalookup: DataLookupService,
    private layout: LayoutComponent
    ) {

      this.datalookup.emitUpdateComplete.subscribe(complete => {

        console.log('despesa-frm:<emitUpdateStatus>');
        this.carregaDataset();

      });

    }

  ngOnInit() {

    this.criaForm();
    this.carregaDataset();

    this.frmDados.idRepres = 8;

  }

  criaForm() {

    this.formDespesa = this.formbuilder.group({
      id: null,
      DataInterval: [[], Validators.compose([Validators.required])],
      Data_Saida: [null, Validators.compose([Validators.required])],
      Data_Retorno: [null, Validators.compose([Validators.required])],
      Roteiro: [null, Validators.compose([Validators.required])],
      Observacoes: [null, Validators.compose([Validators.required])],
      UsuarioAssociado: [null, Validators.compose([Validators.required])],
      id_Evento: null,
      id_Repres: [null, Validators.compose([Validators.required])]
    });

  }

  carregaDataset() {

    // console.log('despesa-frm:<carregaDataset>');
    // console.log(this.updatelist);
    this.updatelist.map(upd => {
      if (this[upd]) {
        // console.log('Atribui o valor na variável ' + upd);
        this[upd] = this.datalookup.getUserData(upd);
      } else {
        // console.log('Necessário criar a variável ' + upd);
        this.layout.showError('Necessário criar a variável ' + upd);
      }
    });

  } // carregaDataset()

  onDataIntervalChange(event: any) {

    if (event.length > 0) {
      event.map(
        (data: any, index: number) => {
          if (index === 0) { this.frmDados.Data_Saida = data; }
          if (index === 1) { this.frmDados.Data_Retorno = data; }
        }
      );
    }

  } // onDataIntervalChange(event: any)

  onTypeaheadSelect(val: string, event: any) {

    this.frmDados[val] = parseInt(event.item.id, 10);

  }

}
