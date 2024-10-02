import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplanationMarkComponent } from './explanation-mark.component';

describe('ExplanationMarkComponent', () => {
  let component: ExplanationMarkComponent;
  let fixture: ComponentFixture<ExplanationMarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplanationMarkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplanationMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
