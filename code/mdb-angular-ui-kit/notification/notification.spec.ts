import { ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';

import { MdbNotificationModule } from './notification.module';
import { MdbNotificationService } from './notification.service';
import { Component, NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  template: `
    <div
      class="toast bg-primary mx-auto"
      id="basic-primary-example"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="toast-header text-white bg-primary">
        <strong class="me-auto">MDBootstrap</strong>
        <small>11 mins ago</small>
        <button
          type="button"
          class="btn-close btn-close-white"
          data-mdb-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div class="toast-body text-white">Primary Basic Example</div>
    </div>
  `,
  providers: [MdbNotificationService],
})
class BasicNotificationComponent {
  constructor(public notification: MdbNotificationService) {}
}

@NgModule({
  declarations: [BasicNotificationComponent],
})
class TestNotificationModule {}

describe('MDB Notification', () => {
  let notification: MdbNotificationService;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let fixture: ComponentFixture<BasicNotificationComponent>;

  beforeEach(fakeAsync(() => {
    const module = TestBed.configureTestingModule({
      imports: [MdbNotificationModule, TestNotificationModule, NoopAnimationsModule],
      teardown: { destroyAfterEach: false },
    });

    TestBed.compileComponents();
    fixture = module.createComponent(BasicNotificationComponent);
  }));

  beforeEach(inject(
    [MdbNotificationService, OverlayContainer],
    (mdbNotification: MdbNotificationService, oc: OverlayContainer) => {
      notification = mdbNotification;
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    }
  ));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should open a modal with a  specified component', () => {
    let notificationContainer = overlayContainerElement.querySelector('mdb-notification-container');
    expect(notificationContainer).toBe(null);

    notification.open(BasicNotificationComponent);

    expect(overlayContainerElement.textContent).toContain('MDBootstrap');

    notificationContainer = overlayContainerElement.querySelector('mdb-notification-container');
    expect(notificationContainer).not.toBe(null);
  });

  it('should stack notifications', () => {
    notification.open(BasicNotificationComponent);
    notification.open(BasicNotificationComponent);
    notification.open(BasicNotificationComponent);

    const notificationContainer = overlayContainerElement.querySelectorAll(
      'mdb-notification-container'
    );
    expect(notificationContainer.length).toBe(3);
  });

  it('should autohide notification', fakeAsync(() => {
    let notificationContainer = overlayContainerElement.querySelector('mdb-notification-container');
    expect(notificationContainer).toBe(null);

    notification.open(BasicNotificationComponent, {
      autohide: true,
    });

    notificationContainer = overlayContainerElement.querySelector('mdb-notification-container');
    expect(notificationContainer).not.toBe(null);

    fixture.detectChanges();
    flush();

    notificationContainer = overlayContainerElement.querySelector('mdb-notification-container');
    expect(notificationContainer).toBe(null);
  }));

  it('should set offset', () => {
    notification.open(BasicNotificationComponent, {
      offset: 100,
    });

    fixture.detectChanges();

    const notificationContainer = overlayContainerElement.querySelector(
      '.cdk-overlay-pane'
    ) as HTMLElement;

    expect(notificationContainer.style.marginRight).toBe('100px');
    expect(notificationContainer.style.marginTop).toBe('100px');
  });
});
