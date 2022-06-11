import { Component, OnInit } from '@angular/core';
import { SpeechRecognitionService } from '../speech-recognition.service';
import {
  ISpeechSynthesis,
  SpeechSynthesisService,
} from '../speech-synthesis.service';

@Component({
  selector: 'app-voice-assistant',
  templateUrl: './voice-assistant.component.html',
  styleUrls: ['./voice-assistant.component.scss'],
})
export class VoiceAssistantComponent implements OnInit {
  public isStoppedSpeechRecog: boolean = true;
  public text: string = '';
  public isSpeaking: boolean = false;

  constructor(
    private speechRecognitionService: SpeechRecognitionService,
    private speechSynthesisService: SpeechSynthesisService
  ) {}

  ngOnInit(): void {
    // this.speechRecognitionService.init();
    this.speechRecognitionService
      .getSpeechStateListener()
      .subscribe((value: boolean) => {
        this.isStoppedSpeechRecog = value;
      });

    this.speechSynthesisService
      .getSynthesisStateListener()
      .subscribe((value: ISpeechSynthesis) => {
        this.isSpeaking = value.speaking;
        this.text = this.speechSynthesisService.getText();
      });
  }

  toggleSpeechRecog() {
    if (this.isStoppedSpeechRecog) {
      this.isStoppedSpeechRecog = false;
      this.text = 'started taking commands! how can I help you?';
      this.speechRecognitionService.start();
      this.isSpeaking = true;
      this.speechSynthesisService.speak({
        text: 'started taking commands! how can I help you?',
      });
    } else {
      this.isStoppedSpeechRecog = true;
      this.text = 'stopped taking commands! Thank you!';
      this.speechRecognitionService.stop();
      this.isSpeaking = true;
      this.speechSynthesisService.speak({
        text: 'stopped taking commands! Thank you!',
      });
    }
  }
}
