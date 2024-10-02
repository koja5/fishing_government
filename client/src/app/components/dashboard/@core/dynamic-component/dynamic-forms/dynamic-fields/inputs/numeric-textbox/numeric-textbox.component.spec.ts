import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericTextboxComponent } from './numeric-textbox.component';

describe('NumericTextboxComponent', () => {
  let component: NumericTextboxComponent;
  let fixture: ComponentFixture<NumericTextboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumericTextboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumericTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
