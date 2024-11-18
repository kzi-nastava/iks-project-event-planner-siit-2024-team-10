import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageOfferingsComponent } from './manage-offerings.component';

describe('ManageOfferingsComponent', () => {
  let component: ManageOfferingsComponent;
  let fixture: ComponentFixture<ManageOfferingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageOfferingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageOfferingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
