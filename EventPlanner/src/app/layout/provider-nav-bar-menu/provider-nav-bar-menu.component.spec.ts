import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderNavBarMenuComponent } from './provider-nav-bar-menu.component';

describe('ProviderNavBarMenuComponent', () => {
  let component: ProviderNavBarMenuComponent;
  let fixture: ComponentFixture<ProviderNavBarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProviderNavBarMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderNavBarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
