import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PoliciesService {
  private policies: any[] = [];
  private isLoading: boolean = true;
  private policiesStateListener = new Subject<any[]>();

  constructor(private firestore: AngularFirestore) {}

  init() {
    this.firestore
      .collection('policies')
      .snapshotChanges()
      .subscribe((data) => {
        data.forEach((item) => {
          this.policies.push(item.payload.doc.data());

          this.isLoading = false;
        });
        this.policiesStateListener.next(this.policies);
      });
  }

  getPolicies() {
    return this.policies;
  }

  getPoliciesStateListener(): Observable<any[]> {
    return this.policiesStateListener.asObservable();
  }

  getIsLoading() {
    return this.isLoading;
  }
}
