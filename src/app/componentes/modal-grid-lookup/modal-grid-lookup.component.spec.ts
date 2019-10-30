import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGridLookupComponent } from './modal-grid-lookup.component';

describe('ModalGridLookupComponent', () => {
  let component: ModalGridLookupComponent;
  let fixture: ComponentFixture<ModalGridLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalGridLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalGridLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
