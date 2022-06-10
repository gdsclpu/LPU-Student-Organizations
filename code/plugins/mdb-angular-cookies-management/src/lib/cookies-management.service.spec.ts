import { TestBed } from '@angular/core/testing';

import { MdbCookiesManagementService } from './cookies-management.service';

describe('MdbCookiesManagementService', () => {
  let service: MdbCookiesManagementService;

  const clearCookies = (cookies) => {
    cookies.forEach((el) => {
      service.remove(el);
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MdbCookiesManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create cookie', () => {
    service.set('testName', 'testValue');

    expect(document.cookie).toBe('testName=testValue');
    clearCookies(['testName']);
  });

  it('should get one cookie', () => {
    service.set('testName', 'testValue');
    service.set('testName2', 'testValue2');

    expect(service.get('testName')).toBe('testValue');
    clearCookies(['testName', 'testName2']);
  });

  it('should get all cookies as an object', () => {
    service.set('testName', 'testValue');
    service.set('testName2', 'testValue2');

    expect(service.get()).toEqual({
      testName: 'testValue',
      testName2: 'testValue2',
    });

    clearCookies(['testName', 'testName2']);
  });

  it('should remove cookie', () => {
    service.set('testName', 'testValue');

    expect(service.get('testName')).toBe('testValue');

    service.remove('testName');

    expect(service.get('testName')).toBe(undefined);
  });

  it('should use URL encoding', () => {
    service.set('()<>@,;:"/[]?={}', '()<>@,;:"/[]?={}');

    expect(document.cookie).not.toBe('()<>@,;:"/[]?={}=()<>@,;:"/[]?={}');

    expect(document.cookie).toBe(
      '%28%29%3C%3E%40%2C%3B%3A%22%2F%5B%5D%3F%3D%7B%7D=()%3C%3E%40%2C%3B%3A%22%2F%5B%5D%3F%3D%7B%7D'
    );

    expect(service.get('()<>@,;:"/[]?={}')).toBe('()<>@,;:"/[]?={}');

    clearCookies(['()<>@,;:"/[]?={}']);
  });

  it('should stringify value', () => {
    service.set('()<>@,;:"/[]?={}', '()<>@,;:"/[]?={}');
    expect(service.get('()<>@,;:"/[]?={}')).toBe('()<>@,;:"/[]?={}');
    service.remove('()<>@,;:"/[]?={}');
    service.set('test', ['value']);

    expect(document.cookie).toBe('test=%5B%22value%22%5D');

    expect(service.get('test')).toBe('["value"]');

    clearCookies(['test']);
  });
});
