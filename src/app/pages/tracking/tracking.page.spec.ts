import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingPage } from './tracking.page';

describe('Tab1Page', () => {
  let component: TrackingPage;
  let fixture: ComponentFixture<TrackingPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(TrackingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
