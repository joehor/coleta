import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService  } from 'ngx-bootstrap/modal';
import { DataLookupService } from '../services/data-lookup.service';

@Component({
  selector: 'app-despesas',
  templateUrl: './despesas.component.html',
  styleUrls: ['./despesas.component.css']
})

export class DespesasComponent implements OnInit {

  modalRef: BsModalRef;
  despdata: any = [];
  loading = true;

  constructor( private datalookup: DataLookupService, private modalService: BsModalService ) {

    this.datalookup.getData('Representantes/Despesas/Lookup', '%', 1, 5)
      .subscribe(data => {
        this.despdata = data;
        const Columns = this.getColumns(this.despdata.Data[0]);
        this.despdata = {...this.despdata, Columns};
        this.loading = false;
      });

  }

  ngOnInit() {
  }

  getColumns(data: any[]) {

    return Object.keys(data);

  }

  isNumber(val: any) {

    // console.log(val + ':' + !isNaN(parseInt(val, 10)) + '|' + typeof(val));
    // return (typeof(val) === 'number');
    return !isNaN(parseInt(val, 10));
    // return !isNaN(parseInt(val, 10)) && (typeof(val) === 'number');

  }

  isDate(val: any) {

    // console.log('Original: ' + val);
    // console.log('Typeof: ' + typeof(val));
    // console.log(val + ':' + !isNaN(parseInt(val, 10)) + '|' + typeof(val));

    if (!this.isNumber(val)) {
      const dateWrapper = new Date(val);
      return !isNaN(dateWrapper.getDate());
    } else {
      return false;
    }

  }

  openDespesa(template: TemplateRef<any>, data: any) {

    console.log('openDespesa::');
    console.log(data);

    this.modalRef = this.modalService.show(template, {class: 'modal-lg', ignoreBackdropClick: true});
    this.modalRef.content.formDespesa.patchValue(data);
    // this.modalRef.content.carregaForm([data]);

  }

}
