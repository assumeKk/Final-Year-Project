import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaLabroomComponent } from './ta-labroom.component';

describe('TaLabroomComponent', () => {
  let component: TaLabroomComponent;
  let fixture: ComponentFixture<TaLabroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaLabroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaLabroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
