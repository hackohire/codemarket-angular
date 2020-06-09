import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecteDeselectComponent } from './selecte-deselect.component';

describe('SelecteDeselectComponent', () => {
  let component: SelecteDeselectComponent;
  let fixture: ComponentFixture<SelecteDeselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecteDeselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecteDeselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
