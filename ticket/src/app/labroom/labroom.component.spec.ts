import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Labroom1Component } from './labroom-1.component';

describe('Labroom1Component', () => {
  let component: Labroom1Component;
  let fixture: ComponentFixture<Labroom1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Labroom1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Labroom1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
