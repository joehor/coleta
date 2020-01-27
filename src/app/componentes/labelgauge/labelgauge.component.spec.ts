import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelgaugeComponent } from './labelgauge.component';

describe('LabelgaugeComponent', () => {
  let component: LabelgaugeComponent;
  let fixture: ComponentFixture<LabelgaugeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelgaugeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelgaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
