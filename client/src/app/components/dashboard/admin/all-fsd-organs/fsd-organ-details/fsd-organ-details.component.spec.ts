import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FsdOrganDetailsComponent } from './fsd-organ-details.component';

describe('FsdOrganDetailsComponent', () => {
  let component: FsdOrganDetailsComponent;
  let fixture: ComponentFixture<FsdOrganDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FsdOrganDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FsdOrganDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
