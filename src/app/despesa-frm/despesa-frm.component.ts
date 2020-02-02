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
    id_Evento: 0
  };
  // testes
  bsrangedata: Date[];


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

      this.datapost.emitDataPost.subscribe(status => {

        console.log('despesa-frm:<emitUpdateStatus>');
        if (status.error) {
          this.layout.showError(status.mensagem);
        } else {
          this.layout.showSuccess(status.mensagem);
        }

      });

    }

  ngOnInit() {

    this.criaForm();
    this.carregaDataset();

    // pega o parametro enviado ...
    this.router.paramMap.subscribe( params => {
      this.frmDados.id = parseInt(params.get('id'), 10);
      this.datalookup.getData('representantes/despesas/lookup', this.frmDados.id, 1, 1)
      .subscribe(data => {
        this.carregaForm( data.Data );
      });
    });

  }

  criaForm() {

    this.formDespesa = this.formbuilder.group({
      id: null,
      Data_Saida: [null, Validators.compose([Validators.required])],
      Data_Retorno: [null, Validators.compose([Validators.required])],
      Roteiro: [null, Validators.compose([Validators.required])],
      Observacoes: null,
      UsuarioAssociado: null,
      id_Evento: null
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

  carregaForm(data: any) {

    console.log('carregaForm: ' + JSON.stringify(data));
    const jsonel = data[0];
    this.formDespesa.patchValue(jsonel);
    this.bsrangedata = [new Date(data[0].Data_Saida), new Date(data[0].Data_Retorno)];
    if (this.despesaseventos.find(ev => ev.id === data[0].id_Evento)) {
      this.lookEvento = this.despesaseventos.find(ev => ev.id === data[0].id_Evento).descricao;
    }
/*    this.formDespesa.controls.id = data.id;
    this.formDespesa.patchValue({Data_Saida: data.Data_Saida});
    this.formDespesa.patchValue({Data_Retorno: data.Data_Retorno});
    this.formDespesa.patchValue({Roteiro: data.Roteiro});
    this.formDespesa.patchValue({Observacoes: data.Observacoes});
    this.formDespesa.patchValue({UsuarioAssociado: data.UsuarioAssociado});
    this.formDespesa.patchValue({id_Evento: data.id_Evento}); */

  } // carregaform()

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

    console.log('Salvando despesa...');
    console.log('formDespesa: ' + JSON.stringify(this.formDespesa.value));
    this.datapost.updateData('representantes/despesas/insert', this.formDespesa.value);

  }

  setdata() {

    // this.formDespesa.patchValue({ rangedata: ['2020-02-06T03:44:56.000Z', '2020-03-22T03:44:56.000Z']});
    // this.bsrangedata = [Date.parse('2020-02-06T03:44:56.000Z'), Date.parse('2020-03-22T03:44:56.000Z')];
    const dtin = new Date('2019-11-29T00:00:00');
    const dtfi = new Date('2019-12-05T00:00:00');
    this.bsrangedata = [dtin, dtfi];
    this.formDespesa.patchValue({Data_Saida: dtin});
    this.formDespesa.patchValue({Data_Retorno: dtfi});

  }

}
