import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAgendaItemComponent } from './edit-agenda-item.component';

describe('EditAgendaItemComponent', () => {
  let component: EditAgendaItemComponent;
  let fixture: ComponentFixture<EditAgendaItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAgendaItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAgendaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
