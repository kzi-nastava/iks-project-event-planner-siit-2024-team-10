import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOfferingsComponent } from './create-offerings.component';

describe('CreateOfferingsComponent', () => {
  let component: CreateOfferingsComponent;
  let fixture: ComponentFixture<CreateOfferingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateOfferingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOfferingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
