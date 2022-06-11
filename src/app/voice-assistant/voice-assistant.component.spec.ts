import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceAssistantComponent } from './voice-assistant.component';

describe('VoiceAssistantComponent', () => {
  let component: VoiceAssistantComponent;
  let fixture: ComponentFixture<VoiceAssistantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceAssistantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceAssistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
