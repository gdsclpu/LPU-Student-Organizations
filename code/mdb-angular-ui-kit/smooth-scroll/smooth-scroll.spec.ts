import { DOCUMENT } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { MdbSmoothScrollDirective } from './smooth-scroll.directive';
import { MdbSmoothScrollModule } from './smooth-scroll.module';

const template = `
<a class="section-link" href="#section-1" #scroll mdbSmoothScroll>Smooth Scroll to #section-1</a>

<section id="section-1" class="mt-4 text-center">
  <p>Here it is #section-1</p>
</section>
`;

const mockDocument = {
  body: document.body,
  documentElement: document.documentElement,
  querySelector: function (...args: [string]) {
    return document.querySelector(...args);
  },
  querySelectorAll: function (...args: [string]) {
    return document.querySelectorAll(...args);
  },
  getElementsByClassName: function (...args: [string]) {
    return document.getElementsByClassName(...args);
  },
};

window.scrollTo = jest.fn();

@Component({
  selector: 'mdb-smooth-scroll-test',
  template: template,
})
class TestSmoothScrollComponent {
  @ViewChild(MdbSmoothScrollDirective, { static: true }) smoothScroll: MdbSmoothScrollDirective;
}

describe('MDB Smooth Scroll', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TestSmoothScrollComponent],
        imports: [MdbSmoothScrollModule],
        providers: [{ provide: DOCUMENT, useValue: mockDocument }],
        teardown: { destroyAfterEach: false },
      }).compileComponents();
    })
  );

  it('should emit scrollStart event on scroll start', fakeAsync(() => {
    const fixture = TestBed.createComponent(TestSmoothScrollComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    const spy = jest.spyOn(component.smoothScroll.scrollStart, 'emit');

    const link = fixture.nativeElement.querySelector('.section-link');

    link.click();
    fixture.detectChanges();
    tick(1000);

    expect(spy).toHaveBeenCalled();
  }));

  it('should emit scrollEnd event when scrolling ends', fakeAsync(() => {
    const fixture = TestBed.createComponent(TestSmoothScrollComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    const spy = jest.spyOn(component.smoothScroll.scrollEnd, 'emit');

    const link = fixture.nativeElement.querySelector('.section-link');

    link.click();
    fixture.detectChanges();

    tick(1000);

    expect(spy).toHaveBeenCalled();
  }));

  it('should cancel scrolling when cancelScroll method is used', fakeAsync(() => {
    const fixture = TestBed.createComponent(TestSmoothScrollComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    const spy = jest.spyOn(component.smoothScroll.scrollCancel, 'emit');

    const link = fixture.nativeElement.querySelector('.section-link');

    link.click();
    fixture.detectChanges();
    component.smoothScroll.cancelScroll();
    tick(1000);

    expect(spy).toHaveBeenCalled();
  }));
});
