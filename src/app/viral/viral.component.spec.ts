import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViralComponent } from './viral.component';

describe('ViralComponent', () => {
  let component: ViralComponent;
  let fixture: ComponentFixture<ViralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
