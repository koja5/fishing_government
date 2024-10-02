import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicRowsComponent } from './dynamic-rows.component';

describe('DynamicRowsComponent', () => {
  let component: DynamicRowsComponent;
  let fixture: ComponentFixture<DynamicRowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicRowsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
