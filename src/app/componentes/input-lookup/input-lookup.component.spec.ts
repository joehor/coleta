import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputLookupComponent } from './input-lookup.component';

describe('InputLookupComponent', () => {
  let component: InputLookupComponent;
  let fixture: ComponentFixture<InputLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
