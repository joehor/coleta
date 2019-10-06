import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColetainjetadaComponent } from './coletainjetada.component';

describe('ColetainjetadaComponent', () => {
  let component: ColetainjetadaComponent;
  let fixture: ComponentFixture<ColetainjetadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColetainjetadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColetainjetadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
