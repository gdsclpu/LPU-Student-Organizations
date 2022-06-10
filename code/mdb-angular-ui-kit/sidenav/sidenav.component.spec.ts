import { TestBed, ComponentFixture, flush, fakeAsync, tick } from '@angular/core/testing';
import {
  ElementRef,
  NgModule,
  Provider,
  QueryList,
  Type,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MdbSidenavModule } from './sidenav.module';
import { Component } from '@angular/core';
import { MdbSidenavComponent } from './sidenav.component';
import { MdbSidenavItemComponent } from './sidenav-item.component';
import { MdbSidenavLayoutComponent } from './sidenav-loyaut.component';

import { MdbCollapseModule } from '../collapse/collapse.module';
import { MdbCollapseDirective } from '../collapse';

describe('MDB Sidenav', () => {
  let fixture: ComponentFixture<TestSidenavComponent>;
  let sidenavLayout: MdbSidenavLayoutComponent;
  let firstItem: ElementRef;
  let secondItem: ElementRef;
  let firstCollapse: ElementRef;
  let secondCollapse: ElementRef;
  let sidenavToggle: ElementRef;
  let sidenavItem: QueryList<MdbSidenavItemComponent>;
  let testComponent: TestSidenavComponent;
  let sidenavComponent: MdbSidenavComponent;
  let collapseElements: QueryList<MdbCollapseDirective>;

  function createComponent<T>(component: Type<T>, providers: Provider[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [MdbSidenavModule, MdbCollapseModule],
      declarations: [component],
      providers: [...providers],
      teardown: { destroyAfterEach: false },
    });

    TestBed.compileComponents();

    return TestBed.createComponent<T>(component);
  }

  beforeEach(() => {
    fixture = createComponent(TestSidenavComponent);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    sidenavLayout = testComponent.sidenavLayout;
    sidenavItem = testComponent.sidenavItem;
    firstItem = testComponent.firstItem;
    secondItem = testComponent.secondItem;
    firstCollapse = testComponent.firstCollapse;
    secondCollapse = testComponent.secondCollapse;
    sidenavComponent = testComponent.sidenavComponent;
    sidenavToggle = testComponent.sidenavToggle;
    collapseElements = testComponent.collapseElements;
  });

  it('should change default options', fakeAsync(() => {
    testComponent.color = 'secondary';
    testComponent.accordion = true;
    testComponent.backdrop = false;
    testComponent.backdropClass = 'test';
    testComponent.closeOnEsc = false;
    testComponent.expandOnHover = true;
    testComponent.hidden = false;
    testComponent.mode = 'push';
    testComponent.scrollContainer = '#testScroll2';
    testComponent.slim = true;
    testComponent.slimCollapsed = true;
    testComponent.slimWidth = 100;
    testComponent.position = 'fixed';
    testComponent.right = true;
    testComponent.transitionDuration = 500;
    testComponent.width = 500;
    testComponent.focusTrap = false;

    fixture.detectChanges();
    tick();
    flush();

    expect(sidenavComponent.color).toBe('secondary');
    expect(sidenavComponent.accordion).toBe(true);
    expect(sidenavComponent.backdrop).toBe(false);
    expect(sidenavComponent.backdropClass).toBe('test');
    expect(sidenavComponent.closeOnEsc).toBe(false);
    expect(sidenavComponent.expandOnHover).toBe(true);
    expect(sidenavComponent.hidden).toBe(false);
    expect(sidenavComponent.mode).toBe('push');
    expect(sidenavComponent.scrollContainer).toBe('#testScroll2');
    expect(sidenavComponent.slim).toBe(true);
    expect(sidenavComponent.slimCollapsed).toBe(true);
    expect(sidenavComponent.slimWidth).toBe(100);
    expect(sidenavComponent.position).toBe('fixed');
    expect(sidenavComponent.right).toBe(true);
    expect(sidenavComponent.transitionDuration).toBe(500);
    expect(sidenavComponent.width).toBe(500);
    expect(sidenavComponent.focusTrap).toBe(false);
  }));

  it('should open and close on togle click', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(false);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavComponent._sidenav.nativeElement.style.transform).toBe('translateX(0%)');

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(true);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavComponent._sidenav.nativeElement.style.transform).toBe('translateX(-100%)');
  }));

  it('should close on backdrop click', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(false);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavComponent._sidenav.nativeElement.style.transform).toBe('translateX(0%)');

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(true);
    sidenavLayout._backdropEl.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavComponent._sidenav.nativeElement.style.transform).toBe('translateX(-100%)');
  }));

  it('should set active el and remove active class for prev el', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    expect(firstItem.nativeElement.classList.contains('active')).toBe(false);
    expect(secondItem.nativeElement.classList.contains('active')).toBe(false);

    firstItem.nativeElement.click();

    expect(firstItem.nativeElement.classList.contains('active')).toBe(true);
    expect(secondItem.nativeElement.classList.contains('active')).toBe(false);

    secondItem.nativeElement.click();

    expect(firstItem.nativeElement.classList.contains('active')).toBe(false);
    expect(secondItem.nativeElement.classList.contains('active')).toBe(true);
  }));

  it('should toggle collapse item group', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    sidenavComponent._collapse.forEach((collapse) => {
      expect(collapse.collapsed).toBe(true);
    });

    firstCollapse.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavComponent._collapse.first.collapsed).toBe(false);
    expect(sidenavComponent._collapse.last.collapsed).toBe(true);

    secondCollapse.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavComponent._collapse.first.collapsed).toBe(false);
    expect(sidenavComponent._collapse.last.collapsed).toBe(false);

    secondCollapse.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavComponent._collapse.first.collapsed).toBe(false);
    expect(sidenavComponent._collapse.last.collapsed).toBe(true);

    firstCollapse.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavComponent._collapse.first.collapsed).toBe(true);
    expect(sidenavComponent._collapse.last.collapsed).toBe(true);
  }));

  it('should close other category list if accordion = true', fakeAsync(() => {
    testComponent.accordion = true;
    fixture.detectChanges();
    flush();

    sidenavComponent._collapse.forEach((collapse) => {
      expect(collapse.collapsed).toBe(true);
    });

    firstCollapse.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavComponent._collapse.first.collapsed).toBe(false);
    expect(sidenavComponent._collapse.last.collapsed).toBe(true);

    secondCollapse.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavComponent._collapse.first.collapsed).toBe(true);
    expect(sidenavComponent._collapse.last.collapsed).toBe(false);

    secondCollapse.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavComponent._collapse.first.collapsed).toBe(true);
    expect(sidenavComponent._collapse.last.collapsed).toBe(true);
  }));

  it('should toggle slim programmatically', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    const sidenavWidth = sidenavComponent.width + 'px';

    expect(sidenavComponent._sidenav.nativeElement.style.width).toBe(sidenavWidth);

    sidenavComponent.toggleSlim();
    fixture.detectChanges();
    flush();

    const sidenavSlimWidth = sidenavComponent.slimWidth + 'px';

    expect(sidenavComponent._sidenav.nativeElement.style.width).toBe(sidenavSlimWidth);
  }));

  it('should toggle mode programmatically', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    expect(sidenavComponent.mode).toBe('over');

    sidenavComponent.setMode('push');
    fixture.detectChanges();
    flush();

    expect(sidenavComponent.mode).toBe('push');
  }));

  it('should set right sidenav', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    expect(sidenavComponent.right).toBe(false);
    expect(sidenavComponent._sidenav.nativeElement.classList.contains('sidenav-right')).toBe(false);

    testComponent.right = true;
    fixture.detectChanges();
    flush();

    expect(sidenavComponent.right).toBe(true);
    expect(sidenavComponent._sidenav.nativeElement.classList.contains('sidenav-right')).toBe(true);
  }));

  it('should show backdrop on open and hide backdrop on close', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    expect(document.querySelector('.sidenav-backdrop')).toBe(null);

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(false);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavComponent.sidenavLayout._backdropEl).not.toBe(null);
    expect(sidenavComponent.sidenavLayout._backdropEl.nativeElement.style.opacity).toBe('1');

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(true);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavComponent.sidenavLayout._backdropEl).not.toBe(null);
    expect(sidenavComponent.sidenavLayout._backdropEl.nativeElement.style.opacity).toBe('0');
  }));

  it('should dont show backdrop if backdrop = false', fakeAsync(() => {
    testComponent.backdrop = false;
    fixture.detectChanges();
    flush();

    expect(document.querySelector('.sidenav-backdrop')).toBe(null);

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(false);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(document.querySelector('.sidenav-backdrop')).toBe(null);

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(true);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(document.querySelector('.sidenav-backdrop')).toBe(null);
  }));

  it('should toggle color', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    expect(sidenavComponent._sidenav.nativeElement.classList.contains('sidenav-primary')).toBe(
      true
    );

    testComponent.color = 'secondary';
    fixture.detectChanges();
    flush();

    expect(sidenavComponent._sidenav.nativeElement.classList.contains('sidenav-secondary')).toBe(
      true
    );
  }));

  it('should add custom backdrop class', fakeAsync(() => {
    testComponent.backdropClass = 'custom-class';
    fixture.detectChanges();
    flush();

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(false);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavComponent.sidenavLayout._backdropEl).not.toBe(null);
    expect(
      sidenavComponent.sidenavLayout._backdropEl.nativeElement.classList.contains('custom-class')
    ).toBe(true);
  }));

  it('should close on esc', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(false);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavComponent._sidenav.nativeElement.style.transform).toBe('translateX(0%)');

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(true);
    const event = new KeyboardEvent('keydown', { code: 'Escape' });
    document.dispatchEvent(event);
    fixture.detectChanges();
    flush();

    expect(sidenavComponent._sidenav.nativeElement.style.transform).toBe('translateX(-100%)');
  }));
});

@Component({
  selector: 'mdb-test-sidenav-item',
  template: `
    <mdb-sidenav-layout>
      <mdb-sidenav
        #sidenav="mdbSidenav"
        [color]="color"
        [accordion]="accordion"
        [backdrop]="backdrop"
        [backdropClass]="backdropClass"
        [closeOnEsc]="closeOnEsc"
        [expandOnHover]="expandOnHover"
        [hidden]="hidden"
        [mode]="mode"
        [scrollContainer]="scrollContainer"
        [slim]="slim"
        [slimCollapsed]="slimCollapsed"
        [slimWidth]="slimWidth"
        [position]="position"
        [right]="right"
        [transitionDuration]="transitionDuration"
        [width]="width"
        [focusTrap]="focusTrap"
      >
        <ul id="testScroll2"></ul>
        <ul class="sidenav-menu" id="testScroll">
          <mdb-sidenav-item>
            <a class="sidenav-link"><i class="far fa-smile fa-fw me-3"></i><span>Link 1</span></a>
          </mdb-sidenav-item>
          <mdb-sidenav-item>
            <a class="sidenav-link" #firstCollapse
              ><i class="fas fa-grin fa-fw me-3"></i><span>Category 1</span></a
            >
            <ul class="sidenav-collapse" mdbCollapse>
              <li class="sidenav-item">
                <a class="sidenav-link" #firstItem>Link 2</a>
              </li>
              <li class="sidenav-item">
                <a class="sidenav-link" #secondItem>Link 3</a>
              </li>
            </ul>
          </mdb-sidenav-item>
          <mdb-sidenav-item>
            <a class="sidenav-link" #secondCollapse
              ><i class="fas fa-grin-wink fa-fw me-3"></i><span>Category 4</span></a
            >
            <ul class="sidenav-collapse" mdbCollapse>
              <li class="sidenav-item">
                <a class="sidenav-link">Link 7</a>
              </li>
              <li class="sidenav-item">
                <a class="sidenav-link">Link 8</a>
              </li>
            </ul>
          </mdb-sidenav-item>
        </ul>
      </mdb-sidenav>
      <mdb-sidenav-content #sidenavContent>
        <!-- Toggler -->
        <button #sidenavToggle class="btn btn-primary" (click)="sidenav.toggle()">
          <i class="fas fa-bars"></i>
        </button>
        <!-- Toggler -->
      </mdb-sidenav-content>
    </mdb-sidenav-layout>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class TestSidenavComponent {
  @ViewChild('firstItem') firstItem: ElementRef;
  @ViewChild('secondItem') secondItem: ElementRef;
  @ViewChild('sidenavToggle') sidenavToggle: ElementRef;
  @ViewChild('firstCollapse') firstCollapse: ElementRef;
  @ViewChild('secondCollapse') secondCollapse: ElementRef;
  @ViewChildren(MdbSidenavItemComponent) sidenavItem: QueryList<MdbSidenavItemComponent>;
  @ViewChild(MdbSidenavLayoutComponent) sidenavLayout: MdbSidenavLayoutComponent;
  @ViewChild(MdbSidenavComponent) sidenavComponent: MdbSidenavComponent;
  @ViewChildren(MdbCollapseDirective) collapseElements: QueryList<MdbCollapseDirective>;

  color = 'primary';
  accordion = false;
  backdrop = true;
  backdropClass: string;
  closeOnEsc = true;
  expandOnHover = false;
  hidden = true;
  mode = 'over';
  scrollContainer = '#testScroll';
  slim = false;
  slimCollapsed = false;
  slimWidth = 70;
  position = 'absolute';
  right = false;
  transitionDuration = 300;
  width = 240;
  focusTrap = true;
}

const routes: Routes = [
  // Main
  { path: '', component: TestSidenavComponent },
  { path: 'test-path', component: TestSidenavComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
