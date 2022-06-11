declare var webkitSpeechRecognition: any;
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechRecognitionService {
  private recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text: string = '';
  tempWords: any;

  constructor() {}

  init() {
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-IN';

    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      this.tempWords = transcript;
      console.log(transcript);
    });
  }

  start() {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log('Speech recognition started');
    this.recognition.addEventListener('end', (condition: any) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log('End speech recognition');
      } else {
        this.wordConcat();
        this.recognition.start();
      }
    });
  }
  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat();
    this.recognition.stop();
    console.log('End speech recognition');
  }

  wordConcat() {
    this.text = this.text + ' ' + this.tempWords + '.';
    this.tempWords = '';
  }
}
