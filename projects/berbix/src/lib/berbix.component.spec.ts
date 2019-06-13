import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BerbixComponent } from './berbix.component';

describe('BerbixComponent', () => {
  let component: BerbixComponent;
  let fixture: ComponentFixture<BerbixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BerbixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BerbixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
