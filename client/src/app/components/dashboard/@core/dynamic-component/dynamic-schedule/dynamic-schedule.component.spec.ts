import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicScheduleComponent } from './dynamic-schedule.component';

describe('DynamicScheduleComponent', () => {
  let component: DynamicScheduleComponent;
  let fixture: ComponentFixture<DynamicScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
