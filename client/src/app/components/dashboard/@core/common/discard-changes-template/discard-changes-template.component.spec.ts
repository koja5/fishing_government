import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmTemplateComponent } from './discard-changes-template.component';

describe('DialogConfirmTemplateComponent', () => {
  let component: DialogConfirmTemplateComponent;
  let fixture: ComponentFixture<DialogConfirmTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogConfirmTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
