import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenEventReportComponent } from './open-event-report.component';

describe('OpenEventReportComponent', () => {
  let component: OpenEventReportComponent;
  let fixture: ComponentFixture<OpenEventReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenEventReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenEventReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
