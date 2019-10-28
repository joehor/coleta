import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataPostService } from '../services/data-post.service';
import { TabsModule } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-despesas',
  templateUrl: './despesas.component.html',
  styleUrls: ['./despesas.component.css']
})
export class DespesasComponent implements OnInit {

  formDespesa: FormGroup;
  error: any;

  constructor(
    private formbuilder: FormBuilder,
    private datapost: DataPostService
    ) { }

  ngOnInit() {
    this.criaForm();
  }

  criaForm() {
    this.formDespesa = this.formbuilder.group({
      Id: [0, Validators.compose([Validators.required])],
      Data_Saida: ['', Validators.compose([Validators.required])],
      Data_Retorno: ['', Validators.compose([Validators.required])],
      Roteiro: ['', Validators.compose([Validators.required])],
      Observacoes: ['', Validators.compose([Validators.required])],
      UsuarioAssociado: ['', Validators.compose([Validators.required])],
      id_Evento: ['', Validators.compose([Validators.required])]
    });
  }

  salvar() {

    this.datapost
      .updateData( 'Representantes/Despesas/Insert', this.formDespesa.value )
      .subscribe(ret => {
        // this.formDespesa.controls[0].value = ret.id;
      },
      error => {
        this.error = error;
      });

  }

  cancelar() {

    console.log('cancelando...');

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
