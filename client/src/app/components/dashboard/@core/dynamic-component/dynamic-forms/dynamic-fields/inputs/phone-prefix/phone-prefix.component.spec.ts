import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonePrefixComponent } from './phone-prefix.component';

describe('PhonePrefixComponent', () => {
  let component: PhonePrefixComponent;
  let fixture: ComponentFixture<PhonePrefixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhonePrefixComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhonePrefixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
