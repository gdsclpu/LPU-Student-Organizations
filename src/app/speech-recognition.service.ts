declare var webkitSpeechRecognition: any;
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { voiceCommandsDataJSON } from 'src/data/voiceCommands';
import checkCommands, { ICheckCommands } from 'src/methods/checkCommands';
import { getRoutes } from 'src/methods/getRoutes';
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
    private router: Router
  ) {
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-IN';
  }

  init() {
    this.recognition.onstart = () => {
      this.isStoppedSpeechRecog = false;
      this.speechStateListener.next(false);
    };

    this.recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();

      const { commandAction, commandType, commandName }: ICheckCommands =
        checkCommands(command);
      if (commandAction && commandName) {
        //     if (commandType === 'stopCommands') {
        //       this.speechSynthesisService.speak({
        //         text: 'stopped taking commands! Thank you!',
        //       });
        //       this.stop();
        //     }
        //     if (commandType === 'navigation') {
        //       const page = command
        //         .toLowerCase()
        //         .replace(commandName, '')
        //         .trim()
        //         .replace('page', '')
        //         .replace('us', '')
        //         .replace('.', '')
        //         .trim();
        //       if (['home', 'index', 'front'].includes(page)) {
        //         this.router.navigate(['/']);
        //         this.speechSynthesisService.speak({
        //           text: `${
        //             (voiceCommandsDataJSON as any)[commandType].responses[0]
        //           } ${page} page`,
        //         });
        //       }
        //       const allPages: string[] = [
        //         'home',
        //         'contact',
        //         'login',
        //         'signup',
        //         'commands',
        //       ];
        //       if (allPages.includes(page)) {
        //         this.router.navigate([`/${page}`]);
        //         this.speechSynthesisService.speak({
        //           text: `${
        //             (voiceCommandsDataJSON as any)[commandType].responses[0]
        //           } ${page} page`,
        //         });
        //       }
        //     }
        //   }
        //   if (commandType === 'scrolling') {
        //     const newCommand = commandName;
        //     const cmd = newCommand
        //       .replace('scroll', '')
        //       .trim()
        //       .replace('to', '')
        //       .trim();
        //     if (cmd === 'top') {
        //       this.speechSynthesisService.speak({
        //         text: 'Scrolling to the top of the page',
        //       });
        //       window.scrollTo(0, 0);
        //     }
        //     if (cmd === 'bottom') {
        //       this.speechSynthesisService.speak({
        //         text: 'Scrolling to the bottom of the page',
        //       });
        //       window.scrollTo(0, document.body.scrollHeight);
        //     }
        //     if (cmd === 'up') {
        //       this.speechSynthesisService.speak({
        //         text: 'Scrolling up by 100 pixel',
        //       });
        //       window.scrollBy(0, -100);
        //     }
        //     if (cmd === 'down') {
        //       this.speechSynthesisService.speak({
        //         text: 'Scrolling Down by 100 pixel',
        //       });
        //       window.scrollBy(0, 100);
        //     }
        //   }
        //   if (commandType === 'openCommands') {
        //     this.speechSynthesisService.speak({
        //       text: 'Opening commands List',
        //     });
        //     this.router.navigate(['/commands']);
        //   }
        //   if (commandType === 'explainCommands') {
        //     const cmdName = command
        //       .replace('explain command', '')
        //       .replace('.', '')
        //       .trim();
        //     const { commandName: cmd, commandType: cType } = checkCommands(cmdName);
        //     if (cmd) {
        //       this.speechSynthesisService.speak({
        //         text: (voiceCommandsDataJSON as any)[
        //           'explainCommands'
        //         ].responses[0].replace(
        //           '*',
        //           (voiceCommandsDataJSON as any)[cType].info
        //         ),
        //       });
        //     } else {
        //       this.speechSynthesisService.speak({
        //         text: 'Command not found. Please select command from commands which is given in commands table. to open commands table please say, show commands',
        //       });
        //     }
      }
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
