import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataPostService } from '../services/data-post.service';

@Component({
  selector: 'app-despesas',
  templateUrl: './despesas.component.html',
  styleUrls: ['./despesas.component.css']
})
export class DespesasComponent implements OnInit {

  formDespesa: FormGroup;
  error: any;
  selected: any;
  lookupevento = {id: 0, descricao: ''};

  constructor(
    private formbuilder: FormBuilder,
    private datapost: DataPostService
    ) { }

  ngOnInit() {
    this.selected = {
      id: '0',
      Data_Saida: Date,
      Data_Retorno: Date,
      Roteiro: '',
      Observacoes: '',
      UsuarioAssociado: '',
      id_Evento: 0
    };

    this.criaForm();
  }

  criaForm() {
    this.formDespesa = this.formbuilder.group({
      id: [this.selected.id, Validators.compose([Validators.required])],
      Data_Saida: [this.selected.Data_Saida, Validators.compose([Validators.required])],
      Data_Retorno: [this.selected.Data_Retorno, Validators.compose([Validators.required])],
      Roteiro: [this.selected.Roteiro, Validators.compose([Validators.required])],
      Observacoes: [this.selected.Observacoes, Validators.compose([Validators.required])],
      UsuarioAssociado: [this.selected.UsuarioAssociado, Validators.compose([Validators.required])],
      id_Evento: [this.selected.id_Evento, Validators.compose([Validators.required])]
    });
  }

  salvar() {

    this.datapost
      .updateData( 'Representantes/Despesas/Insert', this.formDespesa.value )
      .subscribe(ret => {
        // this.formDespesa.controls[0].value = ret.id;
        console.log('despesas=ret: ' + JSON.stringify(ret));
      },
      error => {
        this.error = error;
      });

  }

  cancelar() {

    console.log('cancelando...');

  }

  onSelectData(event: any) {

    console.log('despesas-lookup(onSelectData): ' + JSON.stringify(event));
    this.selected = event;
    // this.formDespesa.setValue(this.selected);
    this.formDespesa.patchValue(this.selected);

    this.lookupevento.id = this.selected.id_Evento;

    // console.log('this.selected.Id_Evento: ' + this.selected.id_Evento);
    // console.log('this.lookupevento: ' + JSON.stringify(this.lookupevento));

  }

/*
  @id int,
@Roteiro varchar(1000),
@Data_Saida datetime,
@Data_Retorno datetime,
@Observacoes varchar(1000),
@UsuarioAssociado varchar(50),
@id_Evento int
*/
}
