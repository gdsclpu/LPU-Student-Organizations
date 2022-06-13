import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subject } from 'rxjs';

export interface IOrganisations {
  Category: string;
  Email: string;
  Facebook: string;
  Facilitator: string;
  'Facilitator Image': string;
  Instagram: string;
  LinkedIn: string;
  Logo: string;
  'Organization Activity': string;
  'Organization Name': string;
  'Purpose Of Organization': string;
  Student: string;
  'Student Image': string;
  Website: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrganisationsService {
  private organisations: IOrganisations[] = [];
  private start: number = 0;
  private end: number = 16;
  isLoading: boolean = true;
  private organisationsStateListener = new Subject<IOrganisations[]>();

  constructor(private firestore: AngularFirestore) {}
  init() {
    this.firestore
      .collection('organisations')
      .snapshotChanges()
      .subscribe((organisations: any) => {
        organisations.forEach((organisation: any) => {
          this.organisations.push(organisation.payload.doc.data());
        });
        this.isLoading = false;
        this.organisationsStateListener.next(
          this.organisations.slice(this.start, this.end)
        );
      });
  }

  getOrganisations() {
    return this.organisations;
  }

  getOrganisationsStateListener(): Observable<IOrganisations[]> {
    return this.organisationsStateListener.asObservable();
  }

  setOrganisationsPaginated(start: number, end: number) {
    this.start = start;
    this.end = end;
    this.organisationsStateListener.next(
      this.organisations.slice(this.start, this.end)
    );
  }

  setOrganisations(organisations: IOrganisations[]) {
    this.organisations = organisations;
    this.organisationsStateListener.next(
      this.organisations.slice(this.start, this.end)
    );
  }

  getOrganisationsStart() {
    return this.start;
  }

  getOrganisationsEnd() {
    return this.end;
  }

  getOrganisationsLength() {
    return this.organisations.length;
  }

  getOrganisationsPaginated() {
    return this.organisations.slice(this.start, this.end);
  }

  getOrganisation(index: number) {
    return this.organisations[index];
  }

  addOrganisation(organisation: IOrganisations) {
    this.organisations.push(organisation);
    this.organisationsStateListener.next(
      this.organisations.slice(this.start, this.end)
    );
  }
}
