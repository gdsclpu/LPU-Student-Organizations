declare var webkitSpeechRecognition: any;
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { voiceCommandsDataJSON } from 'src/data/voiceCommands';
import checkCommands, { ICheckCommands } from 'src/methods/checkCommands';
import { SpeechSynthesisService } from './speech-synthesis.service';

@Injectable({
  providedIn: 'root',
})
export class SpeechRecognitionService {
  private recognition = new webkitSpeechRecognition();
  private speechStateListener = new Subject<boolean>();
  private isStoppedSpeechRecog: boolean = true;

  public text: string = '';
  tempWords: any;

  constructor(
    private speechSynthesisService: SpeechSynthesisService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-IN';
  }

  init() {
    this.recognition.onstart = () => {
      this.isStoppedSpeechRecog = false;
      this.speechStateListener.next(false);
    };

    this.recognition.onend = () => {
      if (!this.isStoppedSpeechRecog) {
        this.recognition.start();
        // console.log('Speech recognition stopped');
        // console.log('muted', this.isStoppedSpeechRecog);
        // this.isStoppedSpeechRecog = true;
        // this.speechStateListener.next(true);
        // this.recognition.stop();
      }
    };
  }

  getSpeechStateListener(): Observable<boolean> {
    return this.speechStateListener.asObservable();
  }

  getText() {
    return this.text;
  }

  getisStoppedSpeechRecog() {
    return this.isStoppedSpeechRecog;
  }

  getRecognition() {
    return this.recognition;
  }

  start() {
    this.recognition.start();
  }
  stop() {
    this.isStoppedSpeechRecog = true;
    this.speechStateListener.next(true);
    this.recognition.stop();
  }
}
