import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaLoginComponent } from './ta-login.component';

describe('TaLoginComponent', () => {
  let component: TaLoginComponent;
  let fixture: ComponentFixture<TaLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
