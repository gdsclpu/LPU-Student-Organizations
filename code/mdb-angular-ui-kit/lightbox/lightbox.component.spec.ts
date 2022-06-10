import { Component, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MdbLightboxModule } from './lightbox.module';
import { MdbLightboxModalComponent } from './lightbox-modal.component';
import { MdbLightboxItemDirective } from './lightbox-item.directive';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const template = `
<mdb-lightbox class="lightbox">
  <div class="row">
    <div class="col-lg-4">
      <img
        mdbLightboxItem
        src="https://mdbootstrap.com/img/Photos/Thumbnails/Slides/1.jpg"
        [img]="'https://mdbcdn.b-cdn.net/img/Photos/Slides/1.jpg'"
        alt="Lightbox image 1"
        class="w-100"
      />
    </div>
    <div class="col-lg-4">
      <img
        mdbLightboxItem
        src="https://mdbootstrap.com/img/Photos/Thumbnails/Slides/2.jpg"
        [img]="'https://mdbcdn.b-cdn.net/img/Photos/Slides/2.jpg'"
        alt="Lightbox image 2"
        class="w-100"
      />
    </div>
    <div class="col-lg-4">
      <img
        mdbLightboxItem
        src="https://mdbootstrap.com/img/Photos/Thumbnails/Slides/3.jpg"
        [img]="'https://mdbcdn.b-cdn.net/img/Photos/Slides/3.jpg'"
        alt="Lightbox image 3"
        class="w-100"
      />
    </div>
  </div>
</mdb-lightbox>
`;

const SELECTOR_LIGHTBOX_MODAL = 'mdb-lightbox-modal';
const SELECTOR_LIGHTBOX_IMG_WRAPPER = '.lightbox-gallery-image';
const SELECTOR_LIGHTBOX_CONTENT = '.lightbox-gallery-content';
const SELECTOR_IMG = `${SELECTOR_LIGHTBOX_MODAL} img`;
const SELECTOR_BTN_NEXT = '.lightbox-gallery-arrow-right button';
const SELECTOR_BTN_PREVIOUS = '.lightbox-gallery-arrow-left button';
const SELECTOR_BTN_CLOSE = '.lightbox-gallery-close-btn';
const SELECTOR_BTN_ZOOM = '.lightbox-gallery-zoom-btn';
const SELECTOR_BTN_FULLSCREEN = '.lightbox-gallery-fullscreen-btn';

@Component({
  selector: 'mdb-lightbox-test',
  template: template,
})
class TestLightboxComponent {
  @ViewChildren(MdbLightboxItemDirective) lightboxItems: QueryList<MdbLightboxItemDirective>;
}

describe('MDB Lightbox', () => {
  let fixture: ComponentFixture<TestLightboxComponent>;
  let component: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestLightboxComponent],
      imports: [MdbLightboxModule, NoopAnimationsModule],
      teardown: { destroyAfterEach: false },
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [MdbLightboxModalComponent],
      },
    });

    fixture = TestBed.createComponent(TestLightboxComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should mount component', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should open on click', fakeAsync(() => {
    const lightboxItem = fixture.componentInstance.lightboxItems.toArray()[1];
    lightboxItem.el.nativeElement.click();

    fixture.detectChanges();
    flush();

    const lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);

    expect(lightboxModal).toBeTruthy();

    const src = document.querySelector(SELECTOR_IMG).getAttribute('src');

    expect(src).toBe(lightboxItem.img);
  }));

  it('should change img', fakeAsync(() => {
    const lightboxItems = fixture.componentInstance.lightboxItems.toArray();
    lightboxItems[0].el.nativeElement.click();

    fixture.detectChanges();
    flush();

    const lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);
    const ativeElementWrapper = document.querySelector(SELECTOR_LIGHTBOX_IMG_WRAPPER);
    const arrowNext: HTMLElement = lightboxModal.querySelector(SELECTOR_BTN_NEXT);
    const arrowPrevious: HTMLElement = lightboxModal.querySelector(SELECTOR_BTN_PREVIOUS);
    let src = document.querySelector(SELECTOR_IMG).getAttribute('src');

    expect(src).toBe(lightboxItems[0].img);

    arrowNext.dispatchEvent(new MouseEvent('click'));
    ativeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();

    src = document.querySelector(SELECTOR_IMG).getAttribute('src');

    expect(src).toBe(lightboxItems[1].img);

    arrowPrevious.dispatchEvent(new MouseEvent('click'));
    ativeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();

    src = document.querySelector(SELECTOR_IMG).getAttribute('src');

    expect(src).toBe(lightboxItems[0].img);
  }));

  it('should close lightbox modal', fakeAsync(() => {
    const lightboxItems = fixture.componentInstance.lightboxItems.toArray();
    lightboxItems[0].el.nativeElement.click();

    fixture.detectChanges();
    flush();

    let lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);
    const closeBtn: HTMLElement = lightboxModal.querySelector(SELECTOR_BTN_CLOSE);

    expect(lightboxModal).toBeTruthy();

    closeBtn.dispatchEvent(new MouseEvent('click'));

    fixture.detectChanges();
    flush();

    lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);

    expect(lightboxModal).not.toBeTruthy();
  }));

  it('should toggle zoom on zoom btn click', fakeAsync(() => {
    const lightboxItems = fixture.componentInstance.lightboxItems.toArray();
    lightboxItems[0].el.nativeElement.click();

    fixture.detectChanges();
    flush();

    let lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);
    const zoomBtn: HTMLElement = lightboxModal.querySelector(SELECTOR_BTN_ZOOM);
    const ativeElementWrapper: HTMLElement = document.querySelector(SELECTOR_LIGHTBOX_IMG_WRAPPER);

    expect(zoomBtn.classList.contains('active')).toBe(false);
    expect(ativeElementWrapper.style.transform).toBe('');

    zoomBtn.dispatchEvent(new MouseEvent('click'));

    fixture.detectChanges();
    flush();

    expect(zoomBtn.classList.contains('active')).toBe(true);
    expect(ativeElementWrapper.style.transform).toBe('scale(2)');

    zoomBtn.dispatchEvent(new MouseEvent('click'));

    fixture.detectChanges();
    flush();

    expect(zoomBtn.classList.contains('active')).toBe(false);
    expect(ativeElementWrapper.style.transform).toBe('scale(1)');
  }));

  it('should toggle zoom on wheel scroll', fakeAsync(() => {
    const lightboxItems = fixture.componentInstance.lightboxItems.toArray();
    lightboxItems[0].el.nativeElement.click();

    fixture.detectChanges();
    flush();

    let lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);
    const zoomBtn: HTMLElement = lightboxModal.querySelector(SELECTOR_BTN_ZOOM);
    const ativeElementWrapper: HTMLElement = document.querySelector(SELECTOR_LIGHTBOX_IMG_WRAPPER);
    const img: HTMLElement = document.querySelector(SELECTOR_IMG);

    expect(zoomBtn.classList.contains('active')).toBe(false);
    expect(ativeElementWrapper.style.transform).toBe('');

    img.dispatchEvent(new WheelEvent('wheel', { deltaY: -100 }));

    fixture.detectChanges();
    flush();

    expect(zoomBtn.classList.contains('active')).toBe(true);
    expect(ativeElementWrapper.style.transform).toBe('scale(2)');

    img.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));

    fixture.detectChanges();
    flush();

    expect(zoomBtn.classList.contains('active')).toBe(false);
    expect(ativeElementWrapper.style.transform).toBe('scale(1)');
  }));

  it('should handle keyboard events', fakeAsync(() => {
    const lightboxItems = fixture.componentInstance.lightboxItems.toArray();
    lightboxItems[0].el.nativeElement.click();

    fixture.detectChanges();
    flush();

    let lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);
    const zoomBtn: HTMLElement = lightboxModal.querySelector(SELECTOR_BTN_ZOOM);
    const ativeElementWrapper: HTMLElement = document.querySelector(SELECTOR_LIGHTBOX_IMG_WRAPPER);
    const img: HTMLElement = document.querySelector(SELECTOR_IMG);

    expect(zoomBtn.classList.contains('active')).toBe(false);
    expect(ativeElementWrapper.style.transform).toBe('');
    expect(img.getAttribute('src')).toBe(lightboxItems[0].img);

    lightboxModal.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
    ativeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    expect(img.getAttribute('src')).toBe(lightboxItems[1].img);

    lightboxModal.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
    ativeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    expect(img.getAttribute('src')).toBe(lightboxItems[0].img);

    lightboxModal.dispatchEvent(new KeyboardEvent('keyup', { key: 'End' }));
    ativeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    expect(img.getAttribute('src')).toBe(lightboxItems[2].img);

    lightboxModal.dispatchEvent(new KeyboardEvent('keyup', { key: 'Home' }));
    ativeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    expect(img.getAttribute('src')).toBe(lightboxItems[0].img);

    lightboxModal.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
    ativeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    expect(zoomBtn.classList.contains('active')).toBe(true);
    expect(ativeElementWrapper.style.transform).toBe('scale(2)');

    lightboxModal.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));
    ativeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    expect(zoomBtn.classList.contains('active')).toBe(false);
    expect(ativeElementWrapper.style.transform).toBe('scale(1)');

    lightboxModal.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    ativeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);

    expect(lightboxModal).not.toBeTruthy();
  }));

  it('should handle double click & double tap', fakeAsync(() => {
    const lightboxItems = fixture.componentInstance.lightboxItems.toArray();
    lightboxItems[0].el.nativeElement.click();

    fixture.detectChanges();
    flush();

    const ativeElementWrapper: HTMLElement = document.querySelector(SELECTOR_LIGHTBOX_IMG_WRAPPER);
    const img: HTMLElement = document.querySelector(SELECTOR_IMG);

    img.dispatchEvent(new MouseEvent('mousedown'));
    img.dispatchEvent(new MouseEvent('mouseup'));
    img.dispatchEvent(new MouseEvent('mousedown'));
    img.dispatchEvent(new MouseEvent('mouseup'));
    ativeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    expect(ativeElementWrapper.style.transform).toBe('scale(2)');

    img.dispatchEvent(new MouseEvent('mousedown'));
    img.dispatchEvent(new MouseEvent('mouseup'));
    img.dispatchEvent(new MouseEvent('mousedown'));
    img.dispatchEvent(new MouseEvent('mouseup'));
    ativeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    expect(ativeElementWrapper.style.transform).toBe('scale(1)');
  }));
});
