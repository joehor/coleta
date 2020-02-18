import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataPostService } from '../services/data-post.service';
import { DataLookupService } from '../services/data-lookup.service';
import { LayoutComponent } from '../layout/layout.component';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef  } from 'ngx-bootstrap/modal';

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
  despesa: any;
  finishload = false;

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
  lookUsuario: string;

  updatelist: any[] = ['despesaseventos'];
  despesaseventos: any[] = [];
  usuarios: any[] = ['MARCELO', 'JOAO', 'PEDRO', 'PAULO'];

  constructor(
    private formbuilder: FormBuilder,
    private datapost: DataPostService,
    private datalookup: DataLookupService,
    private layout: LayoutComponent,
    private router: ActivatedRoute,
    public bsModalRef: BsModalRef
    ) {

      this.datalookup.emitUpdateComplete.subscribe(complete => {

        console.log('despesa-frm:<emitUpdateStatus>');
        this.carregaDataset();

      });

    }

  ngOnInit() {

    /* this.bsModalRef.content.passjson = this.passjson; */

    this.criaForm();
    this.carregaDataset();

    if (this.despesa) {
      console.log(this.despesa);
      this.carregaForm(this.despesa);
    }

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

    const dt = new Date();
    this.formDespesa = this.formbuilder.group({
      id: null,
      Data_Saida: [dt, Validators.compose([Validators.required])],
      Data_Retorno: [dt, Validators.compose([Validators.required])],
      Roteiro: ['', Validators.compose([Validators.required])],
      Observacoes: '',
      UsuarioAssociado: '',
      id_Evento: ''
    });

  }

  carregaDataset() {

    this.updatelist.map(upd => {
      if (this[upd]) {
        // console.log('Atribui o valor na variável ' + upd);
        this[upd] = this.datalookup.getUserData(upd);
      } else {
        // console.log('Necessário criar a variável ' + upd);
        this.layout.showError('Necessário criar a variável ' + upd);
      }
    });

    this.finishload = true;

  } // carregaDataset()

  carregaForm(data: any) {

    console.log('carregaForm::');
    console.log(data);

    if (data) {
      console.log('carregaForm::')
      console.log(JSON.stringify(data));
      const jsonel = data[0];
      this.formDespesa.patchValue(jsonel);
      this.bsrangedata = [new Date(data[0].Data_Saida), new Date(data[0].Data_Retorno)];
      this.idDespesa = data[0].id;

      /* Posiciona o evento */
      if (this.despesaseventos.find(ev => ev.id === data[0].id_Evento)) {
        this.lookEvento = this.despesaseventos.find(ev => ev.id === data[0].id_Evento).descricao;
      } else {
        this.layout.showError('Evento ' + data[0].id_Evento + ' não cadastrado!');
      }

      /* Posiciona o usuario */
      if (this.usuarios.find(ev => ev === data[0].UsuarioAssociado)) {
        this.lookUsuario = this.usuarios.find(ev => ev === data[0].UsuarioAssociado);
      } else {
        this.layout.showError('Usuario ' + data[0].UsuarioAssociado + ' não cadastrado!');
      }
    }

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

  onUsuarioSelect(val: string, event: any) {

    console.log(event);

    this.frmDados[val] = event.value;
    const jsonel = {[val]: this.frmDados[val]};

    console.log('onUsuarioSelect: ' + JSON.stringify(jsonel));

    this.formDespesa.patchValue(jsonel);

  } // onTypeaheadSelect(val: string, event: any)

  salvar() {

    console.log('Salvando despesa...');
    // console.log('formDespesa: ' + JSON.stringify(this.formDespesa.value));
    this.datapost
      .updateData('representantes/despesas/insert', this.formDespesa.value)
      .subscribe(dt => {
        this.layout.showSuccess('Atualizado com sucesso!');
      });

  }

  setdata() {

    // this.formDespesa.patchValue({ rangedata: ['2020-02-06T03:44:56.000Z', '2020-03-22T03:44:56.000Z']});
    // this.bsrangedata = [Date.parse('2020-02-06T03:44:56.000Z'), Date.parse('2020-03-22T03:44:56.000Z')];
    const dtin = new Date('2019-11-29T00:00:00');
    const dtfi = new Date('2019-12-05T00:00:00');
    this.bsrangedata = [dtin, dtfi];
    this.formDespesa.patchValue({Data_Saida: dtin});
    this.formDespesa.patchValue({Data_Retorno: dtfi});

    this.layout.showSuccess('Despesa excluida com sucesso, só que não!!!');
    console.log('Despesa excluida com sucesso, só que não!!!');

  }

  copyClipboard(str: string) {
    this.layout.copyToClipboard(str);
  }

}
