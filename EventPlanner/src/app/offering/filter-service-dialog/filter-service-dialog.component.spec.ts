import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterServiceDialogComponent } from './filter-service-dialog.component';

describe('FilterServiceDialogComponent', () => {
  let component: FilterServiceDialogComponent;
  let fixture: ComponentFixture<FilterServiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterServiceDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterServiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
