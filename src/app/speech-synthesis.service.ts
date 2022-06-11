import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

export interface IArgs {
  voice?: null | any;
  text?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface ISpeechSynthesis {
  speaking: boolean;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class SpeechSynthesisService {
  private speaking: boolean = false;
  private supported: boolean = false;
  private synthesisStateListener = new Subject<ISpeechSynthesis>();
  private text: string = '';

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.supported = true;
    }
  }

  getSynthesisStateListener(): Observable<ISpeechSynthesis> {
    return this.synthesisStateListener.asObservable();
  }

  getText() {
    return this.text;
  }

  getSpeaking() {
    return this.speaking;
  }

  handleEnd = () => {
    this.speaking = false;
    this.text = '';
    this.synthesisStateListener.next({ speaking: false, text: '' });
    // callbackFunctions[0](false);
  };

  speak = (args: IArgs = {}) => {
    const {
      voice = null,
      text = '',
      rate = 1,
      pitch = 1,
      volume = 1,
    }: IArgs = args;

    if (!this.supported) return;

    this.speaking = true;
    this.text = text;
    this.synthesisStateListener.next({ speaking: true, text });

    // Firefox won't repeat an utterance that has been
    // spoken, so we need to create a new instance each time
    const utterance: SpeechSynthesisUtterance =
      new window.SpeechSynthesisUtterance();

    utterance.text = text;
    utterance.voice = voice;
    utterance.onend = this.handleEnd;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    window.speechSynthesis.speak(utterance);
  };

  cancel = (): void => {
    if (!this.supported) return;
    this.speaking = false;
    this.text = '';
    this.synthesisStateListener.next({ speaking: false, text: '' });
    window.speechSynthesis.cancel();
  };
}
