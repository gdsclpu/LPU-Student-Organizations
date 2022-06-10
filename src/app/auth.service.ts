import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

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

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
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

  login(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password).then(() => {
      this.router.navigate(['/']);
      this.authStatusListener.next(true);
    });
  }

  register(email: string, password: string, regNo: Number) {
    this.auth.createUserWithEmailAndPassword(email, password).then(async () => {
      const user = await this.auth.currentUser;
      this.firestore
        .collection('users')
        .doc(user?.uid)
        .set({
          email,
          regNo,
          name: user?.displayName,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          this.router.navigate(['/']);
          this.authStatusListener.next(true);
        });
    });
  }

  logout() {
    this.auth.signOut();
    this.authStatusListener.next(false);
  }
}
