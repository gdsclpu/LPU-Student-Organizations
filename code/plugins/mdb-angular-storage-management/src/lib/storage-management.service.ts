import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MdbStorageManagementService {
  constructor() {}

  set(name: string, value: any, expires?: number | Date): string {
    this.checkExpiry();

    localStorage.setItem(name, JSON.stringify(value));

    if (typeof expires === 'number') {
      const expiryList = this.get('expiryList') || [];

      expires = new Date(Number(new Date()) + expires * 1000 * 60 * 60 * 24);

      if (this.isPresentOnExpiryList(name)) {
        const index = expiryList.findIndex((el) => el[name] !== undefined);
        expiryList[index][name] = expires;
      } else {
        expiryList.push({ [name]: expires });
      }
      localStorage.setItem('expiryList', JSON.stringify(expiryList));
    }

    return `${name}: ${value}, expiries: ${expires}`;
  }

  get(name: string): any {
    this.checkExpiry();

    return JSON.parse(localStorage.getItem(name));
  }

  remove(name: string): void {
    this.checkExpiry();

    localStorage.removeItem(name);

    const expiryList = this.get('expiryList') || [];

    if (this.isPresentOnExpiryList(name)) {
      const filteredList = expiryList.filter((el: {}) => {
        const elKey = Object.keys(el);
        return elKey[0] !== name;
      });

      localStorage.setItem('expiryList', JSON.stringify(filteredList));
    }
  }

  isPresentOnExpiryList(name: string) {
    const expiryList = this.get('expiryList') || [];
    return expiryList.some((el: {}) => {
      return el[name] !== undefined;
    });
  }

  check(name: string, time: number, callback: () => void): void {
    const expiryList = this.get('expiryList') || [];
    const filteredList = expiryList.filter((el: {}) => {
      const elKey = Object.keys(el);
      return elKey[0] === name;
    });

    time *= 6000;

    const intervalId = setInterval(() => {
      if (!filteredList[0]) {
        clearInterval(intervalId);
        return;
      }

      if (new Date(filteredList[0][name]) < new Date()) {
        callback();
        clearInterval(intervalId);
      }

      this.checkExpiry();
    }, time);
  }

  checkExpiry() {
    const expiryList = JSON.parse(localStorage.getItem('expiryList')) || [];
    const now = new Date();

    expiryList.filter((el: {}) => {
      const elKey = Object.keys(el);

      if (now > new Date(el[elKey.toString()])) {
        localStorage.removeItem(elKey[0]);
      }

      return el[elKey.toString()] >= now;
    });
  }
}
