import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReservationDialogComponent } from './product-reservation-dialog.component';

describe('ProductReservationDialogComponent', () => {
  let component: ProductReservationDialogComponent;
  let fixture: ComponentFixture<ProductReservationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductReservationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductReservationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
