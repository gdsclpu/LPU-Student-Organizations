import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { MdbFileUploadComponent } from './file-upload.component';
import { MdbFileUploadModule } from './file-upload.module';

const template = `
  <mdb-file-upload
    #uploader
    [defaultMsg]="defaultMsg"
    [height]="height"
    [disabled]="disabled"
    [removeBtnDisabled]="removeBtnDisabled"
    [defaultPreview]="defaultPreview"
    [maxFileSize]="maxFileSize"
    [acceptedExtensions]="acceptedExtensions"
    [multiple]="multiple"
    [maxFileQuantity]="maxFileQuantity">
  </mdb-file-upload>
`;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-file-upload-test',
  template,
})
class TestFileUploadComponent {
  @ViewChild('uploader', { static: true }) instance: MdbFileUploadComponent;

  defaultMsg = 'Drag and drop a file here or click';
  height: number | null = null;
  disabled = false;
  removeBtnDisabled = false;
  defaultPreview = 'https://mdbootstrap.com/img/Photos/Others/images/89.jpg';
  maxFileSize = Infinity;
  acceptedExtensions: string | null = null;
  multiple = false;
  maxFileQuantity = Infinity;
}

describe('MDB File Upload', () => {
  let fixture: ComponentFixture<TestFileUploadComponent>;
  let element: any;
  let component: any;
  let fileUpload: MdbFileUploadComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestFileUploadComponent],
      imports: [MdbFileUploadModule],
      teardown: { destroyAfterEach: false },
    });
    fixture = TestBed.createComponent(TestFileUploadComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fileUpload = component.instance;
  });

  it('should set and update default message', () => {
    let message = fixture.nativeElement.querySelector('.file-upload-default-message').textContent;

    expect(message).toBe('Drag and drop a file here or click');

    component.defaultMsg = 'Custom message';
    fixture.detectChanges();

    message = fixture.nativeElement.querySelector('.file-upload-default-message').textContent;
    expect(message).toBe('Custom message');
  });

  it('should update height', () => {
    component.height = 500;
    fixture.detectChanges();

    const fileUpload = fixture.nativeElement.querySelector('.file-upload');
    const height = fileUpload.style.height;

    expect(height).toBe('500px');
  });

  it('should disable input if disabled is set to true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.file-upload-input');
    const isDisabled = input.hasAttribute('disabled');

    expect(isDisabled).toBe(true);
  });

  it('should set default preview', () => {
    const previewImg = fixture.nativeElement.querySelector('.file-upload-preview-img');

    expect(previewImg).toBeDefined();
    expect(previewImg.src).toBe('https://mdbootstrap.com/img/Photos/Others/images/89.jpg');
  });

  it('should upload file and create preview', () => {
    const input = fixture.nativeElement.querySelector('.file-upload-input');
    const file = new File([''], 'filename', { type: 'text/plain' });
    const changeEvent = new Event('change');
    Object.defineProperty(changeEvent, 'target', { writable: false, value: { files: [file] } });
    input.dispatchEvent(changeEvent);
    fixture.detectChanges();

    const preview = fixture.nativeElement.querySelectorAll('.file-upload-preview')[0];
    const img = preview.querySelector('.file-upload-preview-img');
    const name = preview.querySelector('.file-upload-file-name').textContent;
    expect(img).toBe(null);
    expect(name).toBe('filename');
  });

  it('should emit addFile and removeFile events', () => {
    jest.spyOn(fileUpload.fileAdded, 'emit');
    jest.spyOn(fileUpload.fileRemoved, 'emit');

    const input = fixture.nativeElement.querySelector('.file-upload-input');
    const file = new File([''], 'filename', { type: 'text/plain' });
    const changeEvent = new Event('change');
    Object.defineProperty(changeEvent, 'target', { writable: false, value: { files: [file] } });
    input.dispatchEvent(changeEvent);
    fixture.detectChanges();

    expect(fileUpload.fileAdded.emit).toHaveBeenCalled();

    const removeBtn = fixture.nativeElement.querySelector('.file-upload-remove-file-btn');
    removeBtn.click();
    fixture.detectChanges();

    expect(fileUpload.fileRemoved.emit).toHaveBeenCalled();
  });

  it('should emit error event', () => {
    jest.spyOn(fileUpload.uploadError, 'emit');

    component.maxFileSize = 1;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('.file-upload-input');
    const file = new File([''], 'filename', { type: 'text/plain' });
    const overMaxSize = 1024 * 1024 * 2;
    Object.defineProperty(file, 'size', { value: overMaxSize });
    const changeEvent = new Event('change');
    Object.defineProperty(changeEvent, 'target', { writable: false, value: { files: [file] } });
    input.dispatchEvent(changeEvent);
    fixture.detectChanges();

    expect(fileUpload.uploadError.emit).toHaveBeenCalled();
  });

  it('should display max size error', () => {
    component.maxFileSize = 1;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('.file-upload-input');
    const file = new File([''], 'filename', { type: 'text/plain' });
    const overMaxSize = 1024 * 1024 * 2;
    Object.defineProperty(file, 'size', { value: overMaxSize });
    const changeEvent = new Event('change');
    Object.defineProperty(changeEvent, 'target', { writable: false, value: { files: [file] } });
    input.dispatchEvent(changeEvent);
    fixture.detectChanges();

    const mainError = fixture.nativeElement.querySelector('.file-upload-main-error').textContent;
    const sizeError = fixture.nativeElement.querySelector('.file-upload-error').textContent;

    expect(mainError).toBe('Ooops, something wrong happened.');
    expect(sizeError).toBe('Your file is too big (Max size 1M)');
  });

  it('should display format error', () => {
    component.acceptedExtensions = '.txt';
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('.file-upload-input');
    const file = new File([''], 'filename', { type: 'application/pdf' });
    const changeEvent = new Event('change');
    Object.defineProperty(changeEvent, 'target', { writable: false, value: { files: [file] } });
    input.dispatchEvent(changeEvent);
    fixture.detectChanges();

    const mainError = fixture.nativeElement.querySelector('.file-upload-main-error').textContent;
    const formatError = fixture.nativeElement.querySelector('.file-upload-error').textContent;

    expect(mainError).toBe('Ooops, something wrong happened.');
    expect(formatError).toBe('Your file has incorrect file format (correct format(s) .txt)');
  });

  it('should change to multiple mode', () => {
    component.multiple = true;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.file-upload-input');
    const isMultiple = input.hasAttribute('multiple');

    expect(isMultiple).toBe(true);
  });

  it('should display multiple previews in multiple mode', () => {
    component.multiple = true;
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('.file-upload-input');
    const file1 = new File([''], 'filename1', { type: 'text/plain' });
    const file2 = new File([''], 'filename2', { type: 'text/plain' });
    const changeEvent = new Event('change');
    Object.defineProperty(changeEvent, 'target', {
      writable: false,
      value: { files: [file1, file2] },
    });
    input.dispatchEvent(changeEvent);
    fixture.detectChanges();

    const previews = fixture.nativeElement.querySelectorAll('.file-upload-preview');
    expect(previews.length).toBe(2);
  });
});
