import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerNavBarMenuComponent } from './organizer-nav-bar-menu.component';

describe('OrganizerNavBarMenuComponent', () => {
  let component: OrganizerNavBarMenuComponent;
  let fixture: ComponentFixture<OrganizerNavBarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizerNavBarMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerNavBarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
