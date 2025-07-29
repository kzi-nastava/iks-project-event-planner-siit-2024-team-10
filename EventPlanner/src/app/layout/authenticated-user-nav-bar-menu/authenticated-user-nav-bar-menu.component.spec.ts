import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticatedUserNavBarMenuComponent } from './authenticated-user-nav-bar-menu.component';

describe('AuthenticatedUserNavBarMenuComponent', () => {
  let component: AuthenticatedUserNavBarMenuComponent;
  let fixture: ComponentFixture<AuthenticatedUserNavBarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticatedUserNavBarMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthenticatedUserNavBarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
