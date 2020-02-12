import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = environment.apptitle;
  carrousel: any[] = [];
  constructor() { }

  ngOnInit() {
    this.carrousel.push(
      { img: 'assets/images/home_carrousel_1.png',
        hint: 'first slide',
        caption: 'First slide label',
        detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
      }
    );
    this.carrousel.push(
      { img: 'assets/images/home_carrousel_2.png',
        hint: 'second slide',
        caption: 'Second slide label',
        detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
      }
    );
    this.carrousel.push(
      { img: 'assets/images/home_carrousel_3.png',
        hint: 'thirth slide',
        caption: 'Thirth slide label',
        detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
      }
    );
  }

}
