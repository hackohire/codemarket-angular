import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareDevMenuComponent } from './software-dev-menu.component';

describe('SoftwareDevMenuComponent', () => {
  let component: SoftwareDevMenuComponent;
  let fixture: ComponentFixture<SoftwareDevMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareDevMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareDevMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
