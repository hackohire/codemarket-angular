import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDreamjobComponent } from './add-dreamjob.component';

describe('AddDreamjobComponent', () => {
  let component: AddDreamjobComponent;
  let fixture: ComponentFixture<AddDreamjobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDreamjobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDreamjobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
