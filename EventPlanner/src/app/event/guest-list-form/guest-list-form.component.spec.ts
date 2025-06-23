import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestListFormComponent } from './guest-list-form.component';

describe('GuestListFormComponent', () => {
  let component: GuestListFormComponent;
  let fixture: ComponentFixture<GuestListFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GuestListFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
