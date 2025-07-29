import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferingCategoryComponent } from './offering-category.component';

describe('OfferingCategoryComponent', () => {
  let component: OfferingCategoryComponent;
  let fixture: ComponentFixture<OfferingCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfferingCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferingCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
