import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpBusinessGrowComponent } from './help-business-grow.component';

describe('HelpBusinessGrowComponent', () => {
  let component: HelpBusinessGrowComponent;
  let fixture: ComponentFixture<HelpBusinessGrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpBusinessGrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpBusinessGrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
