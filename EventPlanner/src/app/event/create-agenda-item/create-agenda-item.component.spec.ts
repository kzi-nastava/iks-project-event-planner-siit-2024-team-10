import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgendaItemComponent } from './create-agenda-item.component';

describe('CreateAgendaItemComponent', () => {
  let component: CreateAgendaItemComponent;
  let fixture: ComponentFixture<CreateAgendaItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAgendaItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAgendaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
