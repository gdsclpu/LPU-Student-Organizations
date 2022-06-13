import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { voiceCommandsDataJSON } from 'src/data/voiceCommands';
import checkCommands, { ICheckCommands } from 'src/methods/checkCommands';
import { SpeechRecognitionService } from '../speech-recognition.service';
import {
  ISpeechSynthesis,
  SpeechSynthesisService,
} from '../speech-synthesis.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-voice-assistant',
  templateUrl: './voice-assistant.component.html',
  styleUrls: ['./voice-assistant.component.scss'],
})
export class VoiceAssistantComponent implements OnInit {
  public isStoppedSpeechRecog: boolean = true;
  public text: string = '';
  public isSpeaking: boolean = false;
  recognition: any = this.speechRecognitionService.getRecognition();
  notificationRef: MdbNotificationRef<ToastComponent> | null = null;

  constructor(
    private speechRecognitionService: SpeechRecognitionService,
    private speechSynthesisService: SpeechSynthesisService,
    private ngZone: NgZone,
    private router: Router,
    private notificationService: MdbNotificationService
  ) {}

  ngOnInit(): void {
    this.speechRecognitionService.init();
    this.speechRecognitionService
      .getSpeechStateListener()
      .subscribe((value: boolean) => {
        this.isStoppedSpeechRecog = value;
      });

    this.speechSynthesisService
      .getSynthesisStateListener()
      .subscribe((value: ISpeechSynthesis) => {
        this.ngZone.run(() => {
          this.text = value.text;
          this.isSpeaking = value.speaking;
          if (!this.recognition) {
            this.recognition = this.speechRecognitionService.getRecognition();
          }
        });
      });

    this.recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      const { commandAction, commandType, commandName }: ICheckCommands =
        checkCommands(command);
      if (commandAction && commandName) {
        if (commandType === 'stopCommands') {
          this.ngZone.run(() => {
            // this.speechSynthesisService.speak({
            //   text: 'stopped taking commands! Thank you!',
            // });
            this.notificationRef = this.notificationService.open(
              ToastComponent,
              {
                data: {
                  text: 'stopped taking commands! Thank you!',
                  type: 'success',
                },
                position: 'top-right',
                delay: 5000,
                autohide: true,
              }
            );
            this.speechRecognitionService.stop();
            return;
          });
        }
        if (commandType === 'navigation') {
          const page = command
            .toLowerCase()
            .replace(commandName, '')
            .trim()
            .replace('page', '')
            .replace('us', '')
            .replace('.', '')
            .trim();
          if (['home', 'index', 'front'].includes(page)) {
            this.ngZone.run(() => {
              this.router.navigate(['/']);
            });
            // this.speechSynthesisService.speak({
            //   text: `${
            //     (voiceCommandsDataJSON as any)[commandType].responses[0]
            //   } ${page} page`,
            // });
            this.notificationRef = this.notificationService.open(
              ToastComponent,
              {
                data: {
                  text: `${
                    (voiceCommandsDataJSON as any)[commandType].responses[0]
                  } ${page} page`,
                  type: 'success',
                },
                position: 'top-right',
                delay: 5000,
                autohide: true,
              }
            );
            return;
          }
          const allPages: string[] = [
            'about',
            'policies',
            'contact',
            'login',
            'signup',
            'commands',
          ];
          if (allPages.includes(page)) {
            this.ngZone.run(() => {
              this.router.navigate([`/${page}`]);
            });
            // this.speechSynthesisService.speak({
            //   text: `${
            //     (voiceCommandsDataJSON as any)[commandType].responses[0]
            //   } ${page} page`,
            // });
            this.notificationRef = this.notificationService.open(
              ToastComponent,
              {
                data: {
                  text: `${
                    (voiceCommandsDataJSON as any)[commandType].responses[0]
                  } ${page} page`,
                  type: 'success',
                },
                position: 'top-right',
                delay: 5000,
                autohide: true,
              }
            );
            return;
          }
        }
        if (commandType === 'scrolling') {
          const newCommand = commandName;
          const cmd = newCommand
            .replace('scroll', '')
            .trim()
            .replace('to', '')
            .trim();
          if (cmd === 'top') {
            this.ngZone.run(() => {
              window.scrollTo(0, 0);
            });

            // this.speechSynthesisService.speak({
            //   text: 'Scrolling to the top of the page',
            // });
            this.notificationRef = this.notificationService.open(
              ToastComponent,
              {
                data: {
                  text: 'Scrolling to the top of the page',
                  type: 'success',
                },
                position: 'top-right',
                delay: 5000,
                autohide: true,
              }
            );

            return;
          }
          if (cmd === 'bottom') {
            this.ngZone.run(() => {
              window.scrollTo(0, document.body.scrollHeight);
            });
            // this.speechSynthesisService.speak({
            //   text: 'Scrolling to the bottom of the page',
            // });
            this.notificationRef = this.notificationService.open(
              ToastComponent,
              {
                data: {
                  text: 'Scrolling to the bottom of the page',
                  type: 'success',
                },
                position: 'top-right',
                delay: 5000,
                autohide: true,
              }
            );
            return;
          }
          if (cmd === 'up') {
            this.ngZone.run(() => {
              window.scrollBy(0, -100);
            });
            // this.speechSynthesisService.speak({
            //   text: 'Scrolling up by 100 pixel',
            // });
            this.notificationRef = this.notificationService.open(
              ToastComponent,
              {
                data: {
                  text: 'Scrolling up by 100 pixel',
                  type: 'success',
                },
                position: 'top-right',
                delay: 5000,
                autohide: true,
              }
            );
            return;
          }
          if (cmd === 'down') {
            this.ngZone.run(() => {
              window.scrollBy(0, 100);
            });
            // this.speechSynthesisService.speak({
            //   text: 'Scrolling Down by 100 pixel',
            // });
            this.notificationRef = this.notificationService.open(
              ToastComponent,
              {
                data: {
                  text: 'Scrolling Down by 100 pixel',
                  type: 'success',
                },
                position: 'top-right',
                delay: 5000,
                autohide: true,
              }
            );
            return;
          }
        }
        if (commandType === 'openCommands') {
          this.ngZone.run(() => {
            this.router.navigate(['/commands']);
          });
          // this.speechSynthesisService.speak({
          //   text: 'Opening commands List',
          // });
          this.notificationRef = this.notificationService.open(ToastComponent, {
            data: {
              text: 'Opening commands List',
              type: 'success',
            },
            position: 'top-right',
            delay: 5000,
            autohide: true,
          });
          return;
        }
        if (commandType === 'explainCommands') {
          const cmdName = command
            .replace('explain command', '')
            .replace('.', '')
            .trim();
          const { commandName: cmd, commandType: cType } =
            checkCommands(cmdName);
          if (cmd) {
            // this.speechSynthesisService.speak({
            //   text: (voiceCommandsDataJSON as any)[
            //     'explainCommands'
            //   ].responses[0].replace(
            //     '*',
            //     (voiceCommandsDataJSON as any)[cType].info
            //   ),
            // });
            this.notificationRef = this.notificationService.open(
              ToastComponent,
              {
                data: {
                  text: (voiceCommandsDataJSON as any)[
                    'explainCommands'
                  ].responses[0].replace(
                    '*',
                    (voiceCommandsDataJSON as any)[cType].info
                  ),

                  type: 'success',
                },
                position: 'top-right',
                delay: 5000,
                autohide: true,
              }
            );
            return;
          } else {
            // this.speechSynthesisService.speak({
            //   text: 'Command not found. Please select command from commands which is given in commands table. to open commands table please say, show commands',
            // });
            this.notificationRef = this.notificationService.open(
              ToastComponent,
              {
                data: {
                  text: 'Command not found. Please select command from commands which is given in commands table. to open commands table please say, show commands',
                  type: 'warning',
                },
                position: 'top-right',
                delay: 5000,
                autohide: true,
              }
            );
            return;
          }
        }
      }
    };
  }

  toggleSpeechRecog() {
    if (this.isStoppedSpeechRecog) {
      this.recognition = this.speechRecognitionService.getRecognition();
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
