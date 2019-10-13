import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentantesLookupComponent } from './representantes-lookup.component';

describe('RepresentantesLookupComponent', () => {
  let component: RepresentantesLookupComponent;
  let fixture: ComponentFixture<RepresentantesLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepresentantesLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepresentantesLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
