import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentApprovalComponent } from './comment-approval.component';

describe('CommentApprovalComponent', () => {
  let component: CommentApprovalComponent;
  let fixture: ComponentFixture<CommentApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
