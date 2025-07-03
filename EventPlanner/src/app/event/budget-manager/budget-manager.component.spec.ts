import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetManagerComponent } from './budget-manager.component';

describe('BudgetManagerComponent', () => {
  let component: BudgetManagerComponent;
  let fixture: ComponentFixture<BudgetManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BudgetManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
