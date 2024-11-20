import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterProductDialogComponent } from './filter-product-dialog.component';

describe('FilterProductDialogComponent', () => {
  let component: FilterProductDialogComponent;
  let fixture: ComponentFixture<FilterProductDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterProductDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
