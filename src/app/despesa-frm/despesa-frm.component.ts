import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataPostService } from '../services/data-post.service';
import { DataLookupService } from '../services/data-lookup.service';
import { LayoutComponent } from '../layout/layout.component';
import { ActivatedRoute } from '@angular/router';

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
  idDespesa: number;
  // form inputs
  frmDados: any = {
    id: 0,
    Data_Saida: '',
    Data_Retorno: '',
    Roteiro: '',
    Observacoes: '',
    UsuarioAssociado: '',
    idEvento: 0
  };


  SaidaRetorno: any;
  lookEvento: string;

  updatelist: any[] = ['despesaseventos'];
  despesaseventos: any[] = [];

  constructor(
    private formbuilder: FormBuilder,
    private datapost: DataPostService,
    private datalookup: DataLookupService,
    private layout: LayoutComponent,
    private router: ActivatedRoute
    ) {

      this.datalookup.emitUpdateComplete.subscribe(complete => {

        console.log('despesa-frm:<emitUpdateStatus>');
        this.carregaDataset();

      });

    }

  ngOnInit() {

    // pega o parametro enviado ...
    this.router.paramMap.subscribe( params => {
        this.idDespesa = parseInt(params.get('id'), 10);
      }
    );
    this.criaForm();
    this.carregaDataset();

  }

  criaForm() {

    this.formDespesa = this.formbuilder.group({
      id: this.idDespesa,
      Data_Saida: [null, Validators.compose([Validators.required])],
      Data_Retorno: [null, Validators.compose([Validators.required])],
      Roteiro: [null, Validators.compose([Validators.required])],
      Observacoes: [null, Validators.compose([Validators.required])],
      UsuarioAssociado: null,
      idEvento: null
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

  onDataIntervalChange(rangefields: any[], event: any) {

    if (event.length > 0) {
      event.map(
        (data: any, index: number) => {
          if (index === 0) { this.formDespesa.patchValue({Data_Saida: data}); }
          if (index === 1) { this.formDespesa.patchValue({Data_Retorno: data}); }
        }
      );
    }

  } // onDataIntervalChange(event: any)

  onTypeaheadSelect(val: string, event: any) {

    this.frmDados[val] = parseInt(event.item.id, 10);
    const jsonel = {[val]: this.frmDados[val]};

    console.log('onTypeaheadSelect: ' + JSON.stringify(jsonel));

    this.formDespesa.patchValue(jsonel);

  } // onTypeaheadSelect(val: string, event: any)

  salvar() {

    this.datapost.updateData('Representantes/Despesas/Insert', this.formDespesa.value);

  }

}
