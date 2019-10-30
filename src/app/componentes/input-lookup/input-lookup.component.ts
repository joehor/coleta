import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { GridComponent } from '../grid/grid.component';

@Component({
  selector: 'app-input-lookup',
  templateUrl: './input-lookup.component.html',
  styleUrls: ['./input-lookup.component.css']
})

export class InputLookupComponent implements OnInit {
  @Input() apiroute: string;
  @Input() title = 'Não Informado';
  @Input() pagesize = 10;

  modalRef: BsModalRef;
  inputid: number;
  inputname: string;
  selected: any;
  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  openModal(template: TemplateRef<any>) {
    this.selected = null;
    this.modalRef = this.modalService.show(template);
  }

  onSelectData(event: any) {

    this.selected = event;
    console.log('representantes-lookup(onSelectData): ' + JSON.stringify(event));

  }

  confirm() {
    console.log('Selecionado o item: ' + JSON.stringify(this.selected));
    this.inputid = this.selected['id'];
    this.inputname = this.selected['nome'];
    this.modalRef.hide();
  }
}
