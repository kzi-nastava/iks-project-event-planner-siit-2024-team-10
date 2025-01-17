import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPersonalComponent } from './edit-personal.component';

describe('EditPersonalComponent', () => {
  let component: EditPersonalComponent;
  let fixture: ComponentFixture<EditPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPersonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
