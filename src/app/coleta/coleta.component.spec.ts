import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColetaComponent } from './coleta.component';

describe('ColetaComponent', () => {
  let component: ColetaComponent;
  let fixture: ComponentFixture<ColetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
