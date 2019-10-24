import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Output() emitSlide = new EventEmitter();
  open = false;

  constructor() { }

  ngOnInit() {
  }

  onSlide() {
    this.open = !this.open;
    this.emitSlide.emit(this.open);
    console.log('sidebar onSlide: ' + this.open);
  }

  onSelectItem() {
    this.open = false;
    this.emitSlide.emit(false);
  }

}
