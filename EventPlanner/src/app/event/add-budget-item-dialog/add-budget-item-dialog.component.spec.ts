import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBudgetItemDialogComponent } from './add-budget-item-dialog.component';

describe('AddBudgetItemDialogComponent', () => {
  let component: AddBudgetItemDialogComponent;
  let fixture: ComponentFixture<AddBudgetItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddBudgetItemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBudgetItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
