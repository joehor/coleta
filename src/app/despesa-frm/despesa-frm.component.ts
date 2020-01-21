import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataPostService } from '../services/data-post.service';
import { DataLookupService } from '../services/data-lookup.service';

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
  error: any;
  success: any;
  selected: any;
  loading = false;
  loadmessage: string;
  updatelist: any[] = ['despesaseventos', 'representantes'];
  idEvento = 6;
  idRepres: number;
  despesaseventos: any;
  representantes: any;

  /*REMOVER*/
  buscadespesa: string;
  despesaseventoslookup: any;

  constructor(
    private formbuilder: FormBuilder,
    private datapost: DataPostService,
    private datalookup: DataLookupService
    ) {

      this.datalookup.emitUpdateStatus.subscribe(data => {

        // console.log('Emite status: ');
        // console.log(data);

        this.loading = !data.complete;
        this.loadmessage = data.mensagem;

        if (this.updatelist.find(ds => ds === data.property)) {
          if (data.complete) {
            if (data.error) {
              this.error = {title: 'Falha na requisição!', mensagem: data.mensagem};
            } else {
              this.success = {mensagem: data.mensagem};
              // a propriedade com o mesmo nome do dataset deve ser previamente criada ...
              this[data.property] = this.datalookup.userdata.Data.find(ds => ds[data.property])[data.property];
            }
          }
        }

      }); // this.datalookup.emitUpdateStatus.subscribe(data =>

      // atualiza os dados se necessário ...
      const newupdate = this.updatelist.filter(
        li => li === Object.keys(this.datalookup.userdata.Data.filter(ds => ds.hasOwnProperty(li))[0])[0]
      );

      if (newupdate.length > 0) { this.datalookup.updateK1Data(newupdate); }

    }

  ngOnInit() {

    this.criaForm();

  }

  criaForm() {
    this.formDespesa = this.formbuilder.group({
      id: [null, Validators.compose([Validators.required])],
      DataInterval: [[], Validators.compose([Validators.required])],
      Data_Saida: [null, Validators.compose([Validators.required])],
      Data_Retorno: [null, Validators.compose([Validators.required])],
      Roteiro: [null, Validators.compose([Validators.required])],
      Observacoes: [null, Validators.compose([Validators.required])],
      UsuarioAssociado: [null, Validators.compose([Validators.required])],
      id_Evento: this.idEvento,
      id_Repres: [this.idRepres, Validators.compose([Validators.required])]
    });
  }

}
