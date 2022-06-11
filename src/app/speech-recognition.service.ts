declare var webkitSpeechRecognition: any;
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpeechRecognitionService {
  private recognition = new webkitSpeechRecognition();
  private speechStateListener = new Subject<boolean>();
  private isStoppedSpeechRecog: boolean = true;

  public text: string = '';
  tempWords: any;

  constructor() {
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-IN';

    this.recognition.onstart = () => {
      this.isStoppedSpeechRecog = false;
      this.speechStateListener.next(false);
    };

    this.recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      this.tempWords = transcript;
      console.log(transcript);
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

  start() {
    this.recognition.start();
  }
  stop() {
    this.isStoppedSpeechRecog = true;
    this.speechStateListener.next(true);
    this.recognition.stop();
  }
}
