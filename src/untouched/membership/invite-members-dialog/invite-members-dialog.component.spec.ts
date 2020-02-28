import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteMembersDialogComponent } from './invite-members-dialog.component';

describe('InviteMembersDialogComponent', () => {
  let component: InviteMembersDialogComponent;
  let fixture: ComponentFixture<InviteMembersDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteMembersDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteMembersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
