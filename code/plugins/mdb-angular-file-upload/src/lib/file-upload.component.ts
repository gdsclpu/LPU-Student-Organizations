import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { mimeTypes } from './file-upload-mimetype-data';

enum UnitSize {
  G = 1000000000,
  M = 1000000,
  K = 1000,
  B = 1,
}

export interface MdbFileUploadError {
  type: string;
  message: string;
}

interface FilePreview {
  file: File;
  name: string;
  extension: string;
  isImage: boolean;
  imageSrc?: string | ArrayBuffer;
}

interface DefaultPreview {
  name: string;
  extension: string;
  isImage: boolean;
  imageSrc?: string;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-file-upload',
  templateUrl: './file-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbFileUploadComponent implements OnInit, OnDestroy {
  @ViewChild('input', { static: true }) input: ElementRef<HTMLInputElement>;
  @ViewChild('previews', { static: true }) previews: ElementRef<HTMLElement>;

  @HostBinding('class.file-upload-wrapper') wrapper = true;

  @Input() maxFileSize: number = Infinity;
  @Input() defaultPreview: string | null = null;
  @Input() height: number | null = null;
  @Input() disabled = false;
  @Input() acceptedExtensions: string | null = null;
  @Input() multiple = false;
  @Input() defaultMsg = 'Drag and drop a file here or click';
  @Input() mainError = 'Ooops, something wrong happened.';
  @Input() maxSizeError = 'Your file is too big (Max size ~~~)';
  @Input() formatError = 'Your file has incorrect file format (correct format(s) ~~~)';
  @Input() quantityError = 'Too many files (allowed quantity of files ~~~)';
  @Input() previewMsg = 'Drag and drop or click to replace';
  @Input() removeBtn = 'Remove';
  @Input() removeBtnDisabled = false;
  @Input() maxFileQuantity: number = Infinity;

  @Output() uploadError: EventEmitter<MdbFileUploadError[]> = new EventEmitter<
    MdbFileUploadError[]
  >();
  @Output() fileAdded: EventEmitter<File[]> = new EventEmitter<File[]>();
  @Output() fileRemoved: EventEmitter<File> = new EventEmitter<File>();

  _errors: MdbFileUploadError[] = [];
  _files: File[] = [];
  _previews: FilePreview[] = [];
  _defaultPreview: DefaultPreview | null = null;

  reset() {
    this.input.nativeElement.value = '';
    this._files = [];
    this._previews = [];
    this._errors = [];
    this._defaultPreview = null;
    this._cdRef.markForCheck();
  }

  _showMainError = false;

  private _imageFileExtensions: string[] = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];

  private _destroy$ = new Subject<void>();

  constructor(private _cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.defaultPreview) {
      this._setupDefaultPreview();
    }

    if (this.multiple) {
      this._setupDragEvents();
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _setupDefaultPreview() {
    const previewParameters = this.defaultPreview.split('/');
    const name = previewParameters[previewParameters.length - 1];
    const extension = name.split('.')[1];
    const isImage = this._imageFileExtensions.includes(extension);
    const imageSrc = isImage && this.defaultPreview;

    this._defaultPreview = { name, isImage, extension, imageSrc };
  }

  private _setupDragEvents() {
    fromEvent(this.previews.nativeElement, 'drop')
      .pipe(takeUntil(this._destroy$))
      .subscribe((event: any) => {
        event.preventDefault();
        const files = event.dataTransfer ? event.dataTransfer.files : [];

        if (files.length) {
          this._handleFileUpload(files);
        }
      });

    fromEvent(this.previews.nativeElement, 'dragover')
      .pipe(takeUntil(this._destroy$))
      .subscribe((event: any) => {
        event.preventDefault();
      });
  }

  _handleChangeEvent(event: any) {
    const files = event.target.files;

    if (!files.length) {
      return;
    }

    this._handleFileUpload(files);
  }

  private _handleFileUpload(files: File[]) {
    this._errors = [];

    this._validateFiles(files);

    if (this._errors.length) {
      this.uploadError.emit(this._errors);
      return;
    }

    const canUploadMoreFiles = this.maxFileQuantity > this._files.length;

    if (this.multiple && !canUploadMoreFiles) {
      return;
    }

    if (this.multiple) {
      this._handleMultipleFileUpload(files);
    } else {
      this._previews = [];
      this._handleSingleFileUpload(files[0]);
    }
  }

  private _validateFiles(files: File[]) {
    Array.from(files).forEach((file) => {
      this._checkFileSize(file);
      this._checkAcceptedExtensions(file);
    });
  }

  _checkFileSize(file: File) {
    const fileSizeMb = file.size / UnitSize.M;

    if (fileSizeMb > this.maxFileSize) {
      const type = 'maxSizeError';
      const message = this.maxSizeError.replace('~~~', `${this.maxFileSize}M`);

      this._errors.push({ type, message });
    }
  }

  _checkAcceptedExtensions(file: File) {
    if (!this.acceptedExtensions) {
      return;
    }
    const extensionsForMapping = [
      '.abw',
      '.arc',
      '.avi',
      '.azw',
      '.bin',
      '.bz',
      '.bz2',
      '.cda',
      '.csh',
      '.doc',
      '.docx',
      '.eot',
      '.epub',
      '.gz',
      '.htm',
      '.ico',
      '.ics',
      '.jar',
      '.js',
      '.json',
      '.jsonld',
      '.midi',
      '.mjs',
      '.mp3',
      '.mp4',
      '.mpeg',
      '.mpkg',
      '.odp',
      '.ods',
      '.odt',
      '.oga',
      '.ogv',
      '.ogx',
      '.opus',
      '.otf',
      '.php',
      '.ppt',
      '.pptx',
      '.rar',
      '.sh',
      '.svg',
      '.swf',
      '.tar',
      '.txt',
      '.vsd',
      '.weba',
      '.xhtml',
      '.xls',
      '.xul',
      '.x3gp',
      '.7z',
    ];

    const acceptedExtensions = this.acceptedExtensions.split(',');

    if (acceptedExtensions.length) {
      const fileMainType = file.type.split('/')[0];
      let fileSecondType = file.type.split('/')[1];

      let isAcceptedFormat = false;

      acceptedExtensions.forEach((format: string) => {
        const isMappingNeeded = extensionsForMapping.indexOf(format) > -1;
        if (isMappingNeeded) {
          fileSecondType = mimeTypes.find((mimeType) => mimeType['ext'] === format)['ext'];
        }
        if (format.includes('/*') && format.includes(fileMainType)) {
          isAcceptedFormat = true;
        } else if (
          format.includes('/') &&
          format.includes(fileMainType) &&
          format.includes(fileSecondType)
        ) {
          isAcceptedFormat = true;
        } else if (format.includes(fileSecondType)) {
          isAcceptedFormat = true;
        }
      });

      if (!isAcceptedFormat) {
        const type = 'formatError';
        const message = this.formatError.replace(
          '~~~',
          this.acceptedExtensions.split(',').join(' ')
        );

        this._errors.push({ type, message });
      }
    }
  }

  private _handleSingleFileUpload(file: File) {
    this._createPreview(file);
    this._files.push(file);
    this.fileAdded.emit([file]);
  }

  private _handleMultipleFileUpload(files: File[]) {
    Array.from(files).forEach((file) => this._createPreview(file));

    this._files = [...this._files, ...files];
    this.fileAdded.emit([...files]);
    this.input.nativeElement.value = '';
  }

  private _createPreview(file: File) {
    const name = file.name;
    const types = file.type.split('/');
    const isImage = types[0] === 'image';
    const extension = types[1];

    let imageSrc: string | ArrayBuffer;

    if (isImage) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        imageSrc = reader.result;
        this._previews.push({ file, name, isImage, imageSrc, extension });
        this._cdRef.markForCheck();
      };
    } else {
      this._previews.push({ file, name, isImage, extension });
    }

    this._cdRef.markForCheck();
  }

  _removeFile(preview: FilePreview) {
    const previewIndex = this._previews.indexOf(preview);
    const fileIndex = this._files.indexOf(preview.file);
    this._previews.splice(previewIndex, 1);
    this._files.splice(fileIndex, 1);
    this.input.nativeElement.value = '';

    this.fileRemoved.emit(preview.file);
  }

  _removeDefaultPreview() {
    this._defaultPreview = null;
  }

  _handlePreviewsClick() {
    if (this.multiple && this._previews.length) {
      this.input.nativeElement.click();
    }
  }
}
