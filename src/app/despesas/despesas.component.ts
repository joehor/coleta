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
  success: any;
  selected: any;
  updatelist: any[] = ['despesaseventos', 'representantes'];

  searcheventos: string;
  despesaseventos: any;

  searchrepres: string;
  representantes: any;

  lookupevento: any;
  loading = false;
  loadmessage: string;

  constructor(
    private formbuilder: FormBuilder,
    private datapost: DataPostService,
    private datalookup: DataLookupService
    ) {

      // this.datasource = this.datalookup.k1data.Data.filter( dt => dt.despesaseventos)[0].despesaseventos;
      this.datalookup.emitUpdateStatus.subscribe(data => {

        console.log('Emite status: ');
        console.log(data);

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


        /*
        if ((data.property === 'despesaseventos')) {
          console.log('achou despesas eventos');
          this.datasource = this.datalookup.userdata.Data.find(dt => dt.hasOwnProperty('despesaseventos')).despesaseventos;
        }
        if ((data.property === 'representantes')) {
          this.datarepres = this.datalookup.userdata.Data.find(dt => dt.hasOwnProperty('representantes')).representantes;
        }
        */

      }); // this.datalookup.emitUpdateStatus.subscribe(data =>

      // console.log('despesas:construtor');
      // console.log(this.datalookup.userdata);

      const newupdate = this.updatelist
        .filter( li => li === Object.keys(this.datalookup.userdata.Data.filter(ds => ds.hasOwnProperty(li))[0])[0] );

      console.log('despesas:newupdate');
      console.log(newupdate);

      // se ficou algo para atualizar passa para o data.lookup
      if (newupdate.length > 0) { this.datalookup.updateK1Data(newupdate); }


      // chama os eventos que precisa atualizar ...
      /*
      if (this.datalookup.userdata.Data.filter(dt => dt.hasOwnProperty('despesaseventos')).length === 0) {
        this.datalookup.k1datalist.map(mtd => {
          if (mtd.method === 'getDespesasEventos') {
            mtd.run = true;
            this.datalookup.updateK1Data();
          }
        });
      }
      */
     // se não tem o dataset despesaseventos atualiza ...
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

  showK1datalist() {
    return {datalist: this.datalookup.k1datalist, k1data: this.datalookup.k1data, userdata: this.datalookup.userdata};
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
        // console.log('despesas=ret: ' + JSON.stringify(ret));
      },
      error => {
        this.error = error;
      });

  }

  cancelar() {

    // console.log('cancelando...');

  }

  onSelectData(event: TypeaheadMatch) {

    //console.log('despesas-lookup(onSelectData): ');
    // console.log(JSON.stringify(event));
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
