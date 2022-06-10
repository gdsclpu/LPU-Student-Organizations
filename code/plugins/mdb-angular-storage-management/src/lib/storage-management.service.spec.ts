import { TestBed } from '@angular/core/testing';

import { MdbStorageManagementService } from './storage-management.service';

describe('MdbStorageManagementService', () => {
  let service: MdbStorageManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MdbStorageManagementService);
  });

  it('should create item', () => {
    localStorage.clear();
    expect(localStorage.length).toBe(0);

    service.set('testName', 'testValue');

    expect(JSON.parse(localStorage.getItem('testName'))).toBe('testValue');
  });

  it('should create store item with expire time', () => {
    localStorage.clear();
    expect(localStorage.length).toBe(0);
    expect(localStorage.getItem('expiryList')).toBe(null);

    const mockDate = new Date(1466424490000);
    let spy = jest
      .spyOn(globalThis, 'Date')
      .mockImplementation(() => mockDate as unknown as string);
    const myDate = new Date();

    service.set('testName', 'testValue', 1);

    expect(JSON.parse(localStorage.getItem('testName'))).toBe('testValue');
    expect(new Date(JSON.parse(localStorage.getItem('expiryList'))[0].testName)).toBe(myDate);

    spy.mockRestore();
  });

  it('should update expired date when item already exist', () => {
    localStorage.clear();
    expect(localStorage.length).toBe(0);
    expect(localStorage.getItem('expiryList')).toBe(null);

    const mockDate = new Date(1466424490000);

    let spy = jest
      .spyOn(globalThis, 'Date')
      .mockImplementation(() => mockDate as unknown as string);

    service.set('testName', 'testValue', 1);

    expect(JSON.parse(localStorage.getItem('testName'))).toBe('testValue');
    expect(new Date(JSON.parse(localStorage.getItem('expiryList'))[0].testName)).toBe(mockDate);
    const mockDate2 = new Date(1466424491111);

    spy = jest.spyOn(globalThis, 'Date').mockImplementation(() => mockDate2 as unknown as string);

    service.set('testName', 'testValue', 1);

    expect(JSON.parse(localStorage.getItem('testName'))).toBe('testValue');
    expect(new Date(JSON.parse(localStorage.getItem('expiryList'))[0].testName)).toBe(mockDate2);

    spy.mockRestore();
  });

  it('should get Storage', () => {
    localStorage.clear();
    expect(localStorage.length).toBe(0);

    service.set('testName', 'testValue');

    expect(service.get('testName')).toBe('testValue');
  });

  it('should remove storage data', () => {
    localStorage.clear();
    expect(localStorage.length).toBe(0);

    localStorage.setItem('testName', 'testValue');

    expect(localStorage.getItem('testName')).toBe('testValue');

    service.remove('testName');

    expect(JSON.parse(localStorage.getItem('testName'))).toBe(null);
  });

  it('should remove storage data, and clear expiry date from expiresList', () => {
    localStorage.clear();
    expect(localStorage.length).toBe(0);

    const mockDate = new Date(1466424490000);

    let spy = jest
      .spyOn(globalThis, 'Date')
      .mockImplementation(() => mockDate as unknown as string);

    service.set('testName', 'testValue', 1);

    expect(JSON.parse(localStorage.getItem('testName'))).toBe('testValue');
    expect(new Date(JSON.parse(localStorage.getItem('expiryList'))[0].testName)).toBe(mockDate);

    spy.mockRestore();

    service.remove('testName');

    expect(JSON.parse(localStorage.getItem('testName'))).toBe(null);
    expect(JSON.parse(localStorage.getItem('expiryList'))[0]).toBe(undefined);
  });

  it('should return true if item exist in expires list', () => {
    localStorage.clear();
    expect(localStorage.length).toBe(0);

    expect(service.isPresentOnExpiryList('testName')).toBe(false);

    const mockDate = new Date(1466424490000);

    let spy = jest
      .spyOn(globalThis, 'Date')
      .mockImplementation(() => mockDate as unknown as string);

    service.set('testName', 'testValue', 1);

    expect(JSON.parse(localStorage.getItem('testName'))).toBe('testValue');
    expect(new Date(JSON.parse(localStorage.getItem('expiryList'))[0].testName)).toBe(mockDate);

    expect(service.isPresentOnExpiryList('testName')).toBe(true);

    spy.mockRestore();
  });

  it('should delete expired item`s', () => {
    localStorage.clear();
    expect(localStorage.length).toBe(0);

    const mockDate = new Date(1466424490000);

    let spy = jest
      .spyOn(globalThis, 'Date')
      .mockImplementation(() => mockDate as unknown as string);

    service.set('testName', 'testValue', -1);

    expect(JSON.parse(localStorage.getItem('testName'))).toBe('testValue');
    expect(new Date(JSON.parse(localStorage.getItem('expiryList'))[0].testName)).toBe(mockDate);

    spy.mockRestore();

    service.checkExpiry();
    console.log(`from expiryList: ${JSON.parse(localStorage.getItem('expiryList'))[0].testName}`);
    console.log(`actual date: ${new Date()}`);
    expect(JSON.parse(localStorage.getItem('testName'))).toBe(null);
  });

  it('should call callback when item is expired', () => {
    jest.useFakeTimers();

    localStorage.clear();
    expect(localStorage.length).toBe(0);

    const callback = jest.fn();
    const mockDate = new Date(1466424490000);

    let spy = jest
      .spyOn(globalThis, 'Date')
      .mockImplementation(() => mockDate as unknown as string);

    service.set('testName', 'testValue', -1);

    expect(JSON.parse(localStorage.getItem('testName'))).toBe('testValue');
    expect(new Date(JSON.parse(localStorage.getItem('expiryList'))[0].testName)).toBe(mockDate);

    spy.mockRestore();

    service.check('testName', 0.0000001, callback);

    jest.runAllTimers();

    expect(callback).toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem('testName'))).toBe(null);
  });
});
