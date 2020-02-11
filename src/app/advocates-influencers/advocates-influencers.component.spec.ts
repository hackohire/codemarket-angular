import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvocatesInfluencersComponent } from './advocates-influencers.component';

describe('AdvocatesInfluencersComponent', () => {
  let component: AdvocatesInfluencersComponent;
  let fixture: ComponentFixture<AdvocatesInfluencersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvocatesInfluencersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvocatesInfluencersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
