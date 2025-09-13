import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeTimePage } from './office-time-page.component';

describe('Tab1Page', () => {
  let component: OfficeTimePage;
  let fixture: ComponentFixture<OfficeTimePage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(OfficeTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
