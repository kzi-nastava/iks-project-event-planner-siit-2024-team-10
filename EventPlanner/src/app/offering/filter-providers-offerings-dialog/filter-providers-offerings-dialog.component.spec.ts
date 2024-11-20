import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterProvidersOfferingsDialogComponent } from './filter-providers-offerings-dialog.component';

describe('FilterProvidersOfferingsDialogComponent', () => {
  let component: FilterProvidersOfferingsDialogComponent;
  let fixture: ComponentFixture<FilterProvidersOfferingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterProvidersOfferingsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterProvidersOfferingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
