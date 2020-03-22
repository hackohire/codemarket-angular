import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DreamjobListComponent } from './dreamjob-list.component';

describe('DreamjobListComponent', () => {
  let component: DreamjobListComponent;
  let fixture: ComponentFixture<DreamjobListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DreamjobListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DreamjobListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
