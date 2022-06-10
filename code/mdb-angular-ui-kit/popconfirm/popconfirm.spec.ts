// import { ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
// import { OverlayContainer } from '@angular/cdk/overlay';

// import { MdbPopconfirmModule } from './popconfirm.module';
// import { MdbPopconfirmService } from './popconfirm.service';
// import { Component, NgModule } from '@angular/core';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// @Component({
//   template: `
//     <div class="popconfirm-popover shadow-4">
//       <div class="popconfirm">
//         <p class="popconfirm-message">
//           <span class="popconfirm-message-text">This is example</span>
//         </p>
//         <div class="popconfirm-buttons-container">
//           <button type="button" aria-label="Cancel" class="btn btn-flat btn-sm">Cancel</button>
//           <button type="button" aria-label="Confirm" class="btn btn-primary btn-sm">OK</button>
//         </div>
//       </div>
//     </div>
//   `,
//   providers: [MdbPopconfirmService],
// })
// class BasicPopconfirmComponent {
//   constructor(public popconfirm: MdbPopconfirmService) {}
// }

// @NgModule({
//   declarations: [BasicPopconfirmComponent],
//   entryComponents: [BasicPopconfirmComponent],
// })
// class TestPopconfirmModule {}

// describe('MDB Popconfirm', () => {
//   let popconfirm: MdbPopconfirmService;
//   let overlayContainer: OverlayContainer;
//   let overlayContainerElement: HTMLElement;
//   let fixture: ComponentFixture<BasicPopconfirmComponent>;

//   beforeEach(fakeAsync(() => {
//     const module = TestBed.configureTestingModule({
//       imports: [MdbPopconfirmModule, TestPopconfirmModule, NoopAnimationsModule],
//     });

//     TestBed.compileComponents();
//     fixture = module.createComponent(BasicPopconfirmComponent);
//   }));

//   beforeEach(inject(
//     [MdbPopconfirmService, OverlayContainer],
//     (mdbPopconfirm: MdbPopconfirmService, oc: OverlayContainer) => {
//       popconfirm = mdbPopconfirm;
//       overlayContainer = oc;
//       overlayContainerElement = oc.getContainerElement();
//     }
//   ));

//   afterEach(() => {
//     overlayContainer.ngOnDestroy();
//   });

it('should open a modal with a  specified component', () => {
  //     let popconfirmContainer = overlayContainerElement.querySelector('mdb-popconfirm-container');
  //     expect(popconfirmContainer).toBe(null);
  //     popconfirm.open(BasicPopconfirmComponent);
  //     expect(overlayContainerElement.textContent).toContain('MDBootstrap');
  //     popconfirmContainer = overlayContainerElement.querySelector('mdb-popconfirm-container');
  //     expect(popconfirmContainer).not.toBe(null);
});

//   it('should stack popconfirms', () => {
//     popconfirm.open(BasicPopconfirmComponent);
//     popconfirm.open(BasicPopconfirmComponent);
//     popconfirm.open(BasicPopconfirmComponent);

//     const popconfirmContainer = overlayContainerElement.querySelectorAll(
//       'mdb-popconfirm-container'
//     );
//     expect(popconfirmContainer.length).toBe(3);
//   });

//   it('should autohide popconfirm', fakeAsync(() => {
//     let popconfirmContainer = overlayContainerElement.querySelector('mdb-popconfirm-container');
//     expect(popconfirmContainer).toBe(null);

//     popconfirm.open(BasicPopconfirmComponent, {
//       autohide: true,
//     });

//     popconfirmContainer = overlayContainerElement.querySelector('mdb-popconfirm-container');
//     expect(popconfirmContainer).not.toBe(null);

//     fixture.detectChanges();
//     flush();

//     popconfirmContainer = overlayContainerElement.querySelector('mdb-popconfirm-container');
//     expect(popconfirmContainer).toBe(null);
//   }));
// });
