import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdbVectorMapComponent } from './vector-map.component';

describe('MdbAngularVectorMapsComponent', () => {
  let component: MdbVectorMapComponent;
  let fixture: ComponentFixture<MdbVectorMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MdbVectorMapComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdbVectorMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
