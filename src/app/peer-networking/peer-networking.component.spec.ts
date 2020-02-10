import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerNetworkingComponent } from './peer-networking.component';

describe('PeerNetworkingComponent', () => {
  let component: PeerNetworkingComponent;
  let fixture: ComponentFixture<PeerNetworkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeerNetworkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerNetworkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
