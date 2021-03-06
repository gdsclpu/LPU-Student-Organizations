import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { ToastComponent } from './toast/toast.component';
import { SpeechSynthesisService } from './speech-synthesis.service';

export interface User {
  email: string;
  regNo: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatusListener = new Subject<boolean>();
  private isLoggedIn: boolean = false;
  private currentUser: any = null;
  notificationRef: MdbNotificationRef<ToastComponent> | null = null;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private notificationService: MdbNotificationService,
    private speechSynthesisService: SpeechSynthesisService
  ) {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.isLoggedIn = true;
        this.currentUser = user;
        this.authStatusListener.next(true);
      } else {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.authStatusListener.next(false);
      }
    });
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }
  getUser() {
    return this.currentUser;
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider)
      .then(async (user: any) => {
        let document: number = 0;
        await this.firestore
          .collection('users')
          .doc(user.user.uid)
          .get()
          .forEach(async (doc) => {
            if (doc.exists) {
              document += 1;
            }
          });

        if (document === 0) {
          this.firestore
            .collection('users')
            .doc(user.user.uid)
            .set({
              email: user.user.email,
              regNo: null,
              name: user.user.displayName,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              this.speechSynthesisService.speak({
                text: 'Successfully Logged In!. Welcome Back!',
              });
              this.notificationRef = this.notificationService.open(
                ToastComponent,
                {
                  data: {
                    text: 'Successfully Logged In!. Welcome Back!',
                    type: 'success',
                  },
                  position: 'top-right',
                  delay: 5000,
                  autohide: true,
                  stacking: true,
                }
              );
              this.isLoggedIn = true;
              this.authStatusListener.next(true);
              this.router.navigate(['/']);
            })
            .catch((error: any) => {
              this.speechSynthesisService.speak({
                text: 'Something went wrong!',
              });
              this.notificationRef = this.notificationService.open(
                ToastComponent,
                {
                  data: { text: 'Something went wrong!', type: 'danger' },
                  position: 'top-right',
                  delay: 5000,
                  autohide: true,
                  stacking: true,
                }
              );
            });
        } else {
          this.speechSynthesisService.speak({
            text: 'Successfully Logged In!. Welcome Back!',
          });
          this.notificationRef = this.notificationService.open(ToastComponent, {
            data: {
              text: 'Successfully Logged In!. Welcome Back!',
              type: 'success',
            },
            position: 'top-right',
            delay: 5000,
            autohide: true,
            stacking: true,
          });
          this.isLoggedIn = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      })
      .catch((error: any) => {
        this.speechSynthesisService.speak({
          text: error.message,
        });
        this.notificationRef = this.notificationService.open(ToastComponent, {
          data: { text: error.message, type: 'danger' },
          position: 'top-right',
          delay: 5000,
          autohide: true,
          stacking: true,
        });
      });
  }

  private oAuthLogin(provider: any) {
    return this.auth.signInWithPopup(provider);
  }

  login(email: string, password: string) {
    this.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.speechSynthesisService.speak({
          text: 'Successfully Logged In!. Welcome Back!',
        });
        this.notificationRef = this.notificationService.open(ToastComponent, {
          data: {
            text: 'Successfully Logged In!. Welcome Back!',
            type: 'success',
          },
          position: 'top-right',
          delay: 5000,
          autohide: true,
          stacking: true,
        });
        this.authStatusListener.next(true);
        this.router.navigate(['/']);
      })
      .catch((error) => {
        this.speechSynthesisService.speak({
          text: 'Invalid Email or Password!',
        });
        this.notificationRef = this.notificationService.open(ToastComponent, {
          data: { text: 'Invalid Email/Password', type: 'danger' },
          position: 'top-right',
          delay: 5000,
          autohide: true,
          stacking: true,
        });
      });
  }

  register(email: string, password: string) {
    this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(async () => {
        const user = await this.auth.currentUser;
        this.firestore
          .collection('users')
          .doc(user?.uid)
          .set({
            email,
            regNo: null,
            name: user?.displayName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            this.speechSynthesisService.speak({
              text: 'Successfully Registered!. You are now Logged In!. Welcome here!',
            });
            this.notificationRef = this.notificationService.open(
              ToastComponent,
              {
                data: {
                  text: 'Successfully Registered!. You are now Logged In!. Welcome here!',
                  type: 'success',
                },
                position: 'top-right',
                delay: 5000,
                autohide: true,
                stacking: true,
              }
            );

            this.router.navigate(['/']);
            this.authStatusListener.next(true);
          });
      })
      .catch((error) => {
        if (error.code) {
          this.speechSynthesisService.speak({
            text: 'This email is already registered!',
          });
          this.notificationRef = this.notificationService.open(ToastComponent, {
            data: {
              text: 'This email is already registered!',
              type: 'danger',
            },
            position: 'top-right',
            delay: 5000,
            autohide: true,
            stacking: true,
          });
        } else {
          this.speechSynthesisService.speak({
            text: 'Something went wrong!',
          });
          this.notificationRef = this.notificationService.open(ToastComponent, {
            data: { text: 'Something went wrong!', type: 'danger' },
            position: 'top-right',
            delay: 5000,
            autohide: true,
            stacking: true,
          });
        }
      });
  }

  logout() {
    this.auth.signOut();
    this.authStatusListener.next(false);
  }
}
