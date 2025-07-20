import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCompanyPhotosComponent } from './update-company-photos.component';

describe('UpdateCompanyPhotosComponent', () => {
  let component: UpdateCompanyPhotosComponent;
  let fixture: ComponentFixture<UpdateCompanyPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateCompanyPhotosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCompanyPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
