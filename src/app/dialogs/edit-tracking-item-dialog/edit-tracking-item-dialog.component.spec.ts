import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrackingItemDialogComponent } from './edit-tracking-item-dialog.component';

describe('NewItemDialogComponent', () => {
  let component: EditTrackingItemDialogComponent;
  let fixture: ComponentFixture<EditTrackingItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTrackingItemDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTrackingItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
