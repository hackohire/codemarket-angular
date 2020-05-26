import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFormTemplateComponent } from './create-form-template.component';

describe('CreateFormTemplateComponent', () => {
  let component: CreateFormTemplateComponent;
  let fixture: ComponentFixture<CreateFormTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFormTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFormTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
