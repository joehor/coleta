import { Component, ElementRef, OnInit, VERSION, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css'],
  animations: [
    trigger('collapse', [
      state('open', style({
        opacity: '1',
        display: 'block',
        transform: 'translate3d(0, 0, 0)'
      })),
      state('closed',   style({
        opacity: '0',
        display: 'none',
        transform: 'translate3d(0, -100%, 0)'
      })),
      transition('closed => open', animate('200ms ease-in')),
      transition('open => closed', animate('100ms ease-out'))
    ])
  ]
})
export class NavmenuComponent implements OnInit {
  @ViewChild('navbarToggler', {read: true, static: false}) navbarToggler: ElementRef;
  collapse = 'closed';

  constructor() { }

  ngOnInit() {
  }

  collapseNav() {
    if (this.navBarTogglerIsVisible()) {
      console.log('collapseNav in NavigationComponent clicking navbarToggler');
      this.navbarToggler.nativeElement.click();
    }
  }

  private navBarTogglerIsVisible() {
    const isVisible: boolean = this.navbarToggler.nativeElement.offsetParent !== null;
    return isVisible;
  }

  toggleCollapse() {
    // this.show = !this.show
      this.collapse = this.collapse == "open" ? 'closed' : 'open';
    }
}
