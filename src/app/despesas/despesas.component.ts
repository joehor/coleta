import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataPostService } from '../services/data-post.service';
import { DataLookupService } from '../services/data-lookup.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';

@Component({
  selector: 'app-despesas',
  templateUrl: './despesas.component.html',
  styleUrls: ['./despesas.component.css']
})
export class DespesasComponent implements OnInit {

  formDespesa: FormGroup;
  error: any;
  selected: any;
  datasource: any;
  lookupevento: any;
  seachevent: string;

  constructor(
    private formbuilder: FormBuilder,
    private datapost: DataPostService,
    private datalookup: DataLookupService
    ) {
      this.datasource = this.datalookup.k1data.Data.filter( dt => dt.despesaseventos)[0].despesaseventos;
    }

  ngOnInit() {
    this.selected = {
      id: '0',
      Data_Saida: Date,
      Data_Retorno: Date,
      Roteiro: '',
      Observacoes: '',
      UsuarioAssociado: '',
      id_Evento: 0,
      LookupEvento: {id: 0, descricao: ''}
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

  onSelectData(event: TypeaheadMatch) {

    console.log('despesas-lookup(onSelectData): ' + JSON.stringify(event));
    this.lookupevento = event;

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
