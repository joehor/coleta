import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DespesaFrmComponent } from './despesa-frm.component';

describe('DespesaFrmComponent', () => {
  let component: DespesaFrmComponent;
  let fixture: ComponentFixture<DespesaFrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DespesaFrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DespesaFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
