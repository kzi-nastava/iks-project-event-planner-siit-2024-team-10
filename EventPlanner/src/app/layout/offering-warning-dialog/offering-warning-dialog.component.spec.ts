import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferingWarningDialogComponent } from './offering-warning-dialog.component';

describe('OfferingWarningDialogComponent', () => {
  let component: OfferingWarningDialogComponent;
  let fixture: ComponentFixture<OfferingWarningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfferingWarningDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferingWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
