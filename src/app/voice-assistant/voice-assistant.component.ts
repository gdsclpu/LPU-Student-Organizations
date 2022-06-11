import { Component, OnInit } from '@angular/core';
import { SpeechRecognitionService } from '../speech-recognition.service';

@Component({
  selector: 'app-voice-assistant',
  templateUrl: './voice-assistant.component.html',
  styleUrls: ['./voice-assistant.component.scss'],
})
export class VoiceAssistantComponent implements OnInit {
  public isStoppedSpeechRecog: boolean = true;
  public text: string = '';

  constructor(private speechRecognitionService: SpeechRecognitionService) {}

  ngOnInit(): void {
    // this.speechRecognitionService.init();
    this.speechRecognitionService
      .getSpeechStateListener()
      .subscribe((value: boolean) => {
        this.isStoppedSpeechRecog = value;
        console.log('muted', this.isStoppedSpeechRecog);
        this.text = this.speechRecognitionService.getText();
      });
  }

  toggleSpeechRecog() {
    if (this.isStoppedSpeechRecog) {
      this.isStoppedSpeechRecog = false;
      this.speechRecognitionService.start();
    } else {
      this.isStoppedSpeechRecog = true;
      this.speechRecognitionService.stop();
    }
  }
}
