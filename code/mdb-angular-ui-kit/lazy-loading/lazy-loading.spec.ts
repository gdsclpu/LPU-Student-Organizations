import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MdbLazyLoadingDirective } from './lazy-loading.directive';
import { MdbLazyLoadingModule } from './lazy-loading.module';

const template = `
<div class="lazy-container" style="min-height: 800px">
  <img
    mdbLazyLoading
    [loadingPlaceholder]="loadingPlaceholder"
    [errorPlaceholder]="errorPlaceholder"
    [delay]="delay"
    [attr.data-src]="imgSrc"
    alt="Example image"
    class="img-fluid my-3 lazy-image"
  />
  <video
    mdbLazyLoading
    [loadingPlaceholder]="loadingPlaceholder"
    [errorPlaceholder]="errorPlaceholder"
    [attr.data-src]="videoSrc"
    class="lazy-video img-fluid"
  ></video>
</div>
`;

@Component({
  selector: 'mdb-lazy-loading-test',
  template: template,
})
class TestLazyLoadingComponent {
  @ViewChild(MdbLazyLoadingDirective) lazyImg: MdbLazyLoadingDirective;
  imgSrc = 'https://mdbootstrap.com/img/Photos/Slides/img%20(102).jpg';
  videoSrc = 'https://mdbootstrap.com/img/video/Sail-Away.mp4';
  loadingPlaceholder = 'https://place-hold.it/838x471?text=Loading';
  errorPlaceholder = 'https://place-hold.it/838x471?text=Error';
  delay = 0;
}

describe('MDB Lazy Loading', () => {
  let fixture: ComponentFixture<TestLazyLoadingComponent>;
  let component: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestLazyLoadingComponent],
      imports: [MdbLazyLoadingModule],
      teardown: { destroyAfterEach: false },
    });
    fixture = TestBed.createComponent(TestLazyLoadingComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should trigger lazy load on img element after some amount of time', fakeAsync(() => {
    const img = fixture.nativeElement.querySelector('.lazy-image');

    expect(img.dataset.src).toBe(component.imgSrc);

    img.getBoundingClientRect = () => ({
      top: 100,
      height: 100,
      bottom: 1100,
    });

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1400, writable: true });
    window.dispatchEvent(new CustomEvent('scroll'));

    fixture.detectChanges();
    flush();

    expect(img.src).toBe(component.imgSrc);
    expect(img.dataset.src).toBe(undefined);
  }));

  it('should trigger lazy load on video element after some amount of time', fakeAsync(() => {
    const video = fixture.nativeElement.querySelector('.lazy-video');

    expect(video.dataset.src).toBe(component.videoSrc);

    video.getBoundingClientRect = () => ({
      top: 100,
      height: 100,
      bottom: 1100,
    });

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1400, writable: true });
    window.dispatchEvent(new CustomEvent('scroll'));

    fixture.detectChanges();
    flush();

    expect(video.src).toBe(component.videoSrc);
    expect(video.dataset.src).toBe(undefined);
  }));

  it('should show placeholder before original images is loaded', fakeAsync(() => {
    const img = fixture.nativeElement.querySelector('.lazy-image');

    expect(img.dataset.src).toBe(component.imgSrc);

    img.getBoundingClientRect = () => ({
      top: 100,
      height: 100,
      bottom: 1100,
    });

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1400, writable: true });
    window.dispatchEvent(new CustomEvent('scroll'));

    expect(img.src).toBe(component.loadingPlaceholder);

    fixture.detectChanges();
    flush();

    expect(img.src).toBe(component.imgSrc);
    expect(img.dataset.src).toBe(undefined);
  }));

  it('shoud load element with a delay', fakeAsync(() => {
    const img = fixture.nativeElement.querySelector('.lazy-image');
    component.delay = 5000;

    fixture.detectChanges();

    expect(img.dataset.src).toBe(component.imgSrc);

    img.getBoundingClientRect = () => ({
      top: 100,
      height: 100,
      bottom: 1100,
    });

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1400, writable: true });
    window.dispatchEvent(new CustomEvent('scroll'));

    expect(img.src).toBe(component.loadingPlaceholder);

    fixture.detectChanges();
    tick(5000);

    expect(img.src).toBe(component.imgSrc);
    expect(img.dataset.src).toBe(undefined);
  }));

  it('should show error placeholder if error occurs while loading original image', fakeAsync(() => {
    const img = fixture.nativeElement.querySelector('.lazy-image');
    component.imgSrc = '';

    fixture.detectChanges();

    expect(img.dataset.src).toBe('');

    img.getBoundingClientRect = () => ({
      top: 100,
      height: 100,
      bottom: 1100,
    });

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1400, writable: true });
    window.dispatchEvent(new CustomEvent('scroll'));

    expect(img.src).toBe(component.loadingPlaceholder);

    fixture.detectChanges();
    flush();

    expect(img.src).toBe(component.errorPlaceholder);
  }));

  it('should trigger lazy load on img element after some amount of time', fakeAsync(() => {
    const img = fixture.nativeElement.querySelector('.lazy-image');

    expect(img.dataset.src).toBe(component.imgSrc);

    img.getBoundingClientRect = () => ({
      top: 100,
      height: 100,
      bottom: 1100,
    });

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1400, writable: true });
    window.dispatchEvent(new CustomEvent('scroll'));

    fixture.detectChanges();
    flush();

    expect(img.src).toBe(component.imgSrc);
    expect(img.dataset.src).toBe(undefined);
  }));

  it('should emit loading start event', fakeAsync(() => {
    const img = fixture.nativeElement.querySelector('.lazy-image');
    component.imgSrc = 'https://mdbootstrap.com/img/Photos/Slides/img%20(102).jpg';

    fixture.detectChanges();

    const spy = jest.spyOn(component.lazyImg.loadingStart, 'emit');

    img.getBoundingClientRect = () => ({
      top: 100,
      height: 100,
      bottom: 1100,
    });

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1400, writable: true });
    window.dispatchEvent(new CustomEvent('scroll'));

    flush();
    expect(spy).toHaveBeenCalled();
  }));

  it('should emit loading error event', fakeAsync(() => {
    const img = fixture.nativeElement.querySelector('.lazy-image');
    component.imgSrc = '';

    fixture.detectChanges();

    const spy = jest.spyOn(component.lazyImg.loadingError, 'emit');

    img.getBoundingClientRect = () => ({
      top: 100,
      height: 100,
      bottom: 1100,
    });

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 1400, writable: true });
    window.dispatchEvent(new CustomEvent('scroll'));

    flush();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  }));
});
