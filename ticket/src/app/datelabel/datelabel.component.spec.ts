import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatelabelComponent } from './datelabel.component';

describe('DatelabelComponent', () => {
  let component: DatelabelComponent;
  let fixture: ComponentFixture<DatelabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatelabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatelabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
