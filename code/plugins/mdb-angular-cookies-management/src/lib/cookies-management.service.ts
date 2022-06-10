import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MdbCookiesManagementService {
  constructor() {}

  set(name: string, value: any, attributes: any = {}): string {
    attributes = Object.assign(attributes, { path: '/' });

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Number(new Date()) + attributes.expires * 1000 * 60 * 60 * 24);
    }

    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    const stringifiedValue = JSON.stringify(value);
    if (/^[{[]/.test(stringifiedValue)) {
      value = stringifiedValue;
    }

    value = encodeURIComponent(String(value));

    name = encodeURIComponent(String(name)).replace(/[()]/g, escape);

    let stringifiedAttributes = '';
    Object.keys(attributes).forEach((name: string) => {
      stringifiedAttributes += `; ${name}`;
      stringifiedAttributes += `=${attributes[name].split(';')[0]}`;
    });

    return (document.cookie = `${name}=${value}${stringifiedAttributes}`);
  }

  get(name?: string): string {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    const result = {};

    cookies.forEach((el: string) => {
      const cookie = el.split('=');
      let cookieValue = cookie.slice(1).join('=');

      const cookieName = cookie[0].replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);

      cookieValue = cookieValue.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);

      result[cookieName] = cookieValue;
    });
    return name ? result[name] : result;
  }

  remove(name: string): void {
    this.set(name, '', { expires: -1 });
  }
}
