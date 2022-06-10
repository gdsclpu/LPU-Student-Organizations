import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MdbStickyModule } from './index';
import { MdbStickyDirective } from './index';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mdb-test-sticky',
  template: `<div style="min-height: 500px" class="text-center" #parent>
    <a
      id="sticky"
      type="button"
      href="https://mdbootstrap.com/docs/jquery/getting-started/download/"
      class="btn btn-outline-primary bg-white sticky"
      mdbSticky
      [stickyBoundary]="parent"
      [stickyActiveClass]="activeClass"
      [stickyDirection]="direction"
      [stickyPosition]="position"
      >Download MDB
    </a>
  </div>`,
})
// tslint:disable-next-line: component-class-suffix
class TestStickyComponent {
  activeClass = '';
  direction = 'down';
  boundary = 'patent';
  position = 'top';
}

describe('MDB Sticky', () => {
  describe('after init', () => {
    let fixture: ComponentFixture<TestStickyComponent>;
    let element: any;
    let component: any;
    let directive: any;
    let stickyElement: any;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MdbStickyModule],
        declarations: [TestStickyComponent],
        teardown: { destroyAfterEach: false },
      });
      fixture = TestBed.createComponent(TestStickyComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      directive = fixture.debugElement
        .query(By.directive(MdbStickyDirective))
        .injector.get(MdbStickyDirective) as MdbStickyDirective;
      stickyElement = component.stickyElement;

      fixture.detectChanges();
    });

    it('should start sticky after scroll', () => {
      expect(directive.isSticked).toBe(false);

      window = Object.assign(window, { pageYOffset: 100 });
      window.dispatchEvent(new CustomEvent('scroll'));

      expect(directive.isSticked).toBe(true);
    });

    it('should stop sticky after scroll top', () => {
      expect(directive.isSticked).toBe(false);

      window = Object.assign(window, { pageYOffset: 100 });
      window.dispatchEvent(new CustomEvent('scroll'));

      expect(directive.isSticked).toBe(true);

      window = Object.assign(window, { pageYOffset: 50 });
      window.dispatchEvent(new CustomEvent('scroll'));

      expect(directive.isSticked).toBe(false);
    });

    describe('direction === `up`', () => {
      it('should activate component when client scroll window up', () => {
        component.direction = 'up';
        fixture.detectChanges();

        expect(directive.isSticked).toEqual(false);

        window = Object.assign(window, { pageYOffset: 100 });
        window.dispatchEvent(new CustomEvent('scroll'));

        expect(directive.isSticked).toEqual(false);

        window = Object.assign(window, { pageYOffset: 50 });
        window.dispatchEvent(new CustomEvent('scroll'));

        expect(directive.isSticked).toEqual(true);
      });

      it('should deactivate component when client scroll window down', () => {
        component.direction = 'up';
        fixture.detectChanges();

        expect(directive.isSticked).toEqual(false);

        window = Object.assign(window, { pageYOffset: 100 });
        window.dispatchEvent(new CustomEvent('scroll'));

        expect(directive.isSticked).toEqual(false);

        window = Object.assign(window, { pageYOffset: 50 });
        window.dispatchEvent(new CustomEvent('scroll'));

        expect(directive.isSticked).toEqual(true);

        window = Object.assign(window, { pageYOffset: 150 });
        window.dispatchEvent(new CustomEvent('scroll'));

        expect(directive.isSticked).toEqual(false);
      });
    });
    describe('direction === `both`', () => {
      it('should activate component when client scroll window up or down', () => {
        component.direction = 'both';
        fixture.detectChanges();

        expect(directive.isSticked).toEqual(false);

        window = Object.assign(window, { pageYOffset: 100 });
        window.dispatchEvent(new CustomEvent('scroll'));

        expect(directive.isSticked).toEqual(true);

        window = Object.assign(window, { pageYOffset: 50 });
        window.dispatchEvent(new CustomEvent('scroll'));

        expect(directive.isSticked).toEqual(true);
      });
    });
  });
});
