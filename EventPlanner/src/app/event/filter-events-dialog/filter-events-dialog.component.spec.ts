import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterEventsDialogComponent } from './filter-events-dialog.component';

describe('FilterEventsDialogComponent', () => {
  let component: FilterEventsDialogComponent;
  let fixture: ComponentFixture<FilterEventsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterEventsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterEventsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
