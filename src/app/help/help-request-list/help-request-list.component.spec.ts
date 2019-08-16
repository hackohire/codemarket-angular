import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpRequestListComponent } from './help-request-list.component';

describe('HelpRequestListComponent', () => {
  let component: HelpRequestListComponent;
  let fixture: ComponentFixture<HelpRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpRequestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
