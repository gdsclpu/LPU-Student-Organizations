import { Component, NgZone, OnInit } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { IOrganisations, OrganisationsService } from '../organisations.service';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { SpeechSynthesisService } from '../speech-synthesis.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss'],
})
export class OrganisationsComponent implements OnInit {
  modalRef: MdbModalRef<ModalComponent> | null = null;
  organisations: IOrganisations[] = [];
  isLoading: boolean = true;
  start = 0;
  end = 16;
  length = 0;
  notificationRef: MdbNotificationRef<ToastComponent> | null = null;

  constructor(
    private modalService: MdbModalService,
    private organisationsService: OrganisationsService,
    private ngZone: NgZone,
    private notificationService: MdbNotificationService,
    private speechSynthesisService: SpeechSynthesisService
  ) {
    this.organisationsService.init();
    this.organisations = [];
    this.ngZone.run(() => {
      this.organisationsService
        .getOrganisationsStateListener()
        .subscribe((organisations: any) => {
          this.organisations = organisations;
          this.isLoading = this.organisationsService.isLoading;
          this.start = this.organisationsService.getOrganisationsStart();
          this.end = this.organisationsService.getOrganisationsEnd();
          this.length = this.organisationsService.getOrganisationsLength();
        });
    });
  }

  ngOnInit(): void {}

  showDetails(organisation: IOrganisations) {
    this.modalRef = this.modalService.open(ModalComponent, {
      data: { organisation },
    });
    this.speechSynthesisService.speak({
      text: `Opened details of organization, ${organisation['Organization Name']}`,
    });
    this.notificationRef = this.notificationService.open(ToastComponent, {
      data: {
        text: `Opened details of organization, ${organisation['Organization Name']}`,
        type: 'success',
      },
      delay: 3000,
      stacking: true,
      position: 'top-right',
      autohide: true,
    });
  }

  next() {
    this.organisationsService.setOrganisationsPaginated(
      this.organisationsService.getOrganisationsStart() + 16,
      this.organisationsService.getOrganisationsEnd() + 16
    );
    this.notificationRef = this.notificationService.open(ToastComponent, {
      data: {
        text: `Showing ${this.start + 1} - ${
          this.end
        } of ${this.organisationsService.getOrganisationsLength()} organisations!`,
        type: 'success',
      },
      delay: 3000,
      stacking: true,
      position: 'top-right',
      autohide: true,
    });

    this.speechSynthesisService.speak({
      text: `Showing ${this.start + 1} - ${
        this.end
      } of ${this.organisationsService.getOrganisationsLength()} organisations!`,
    });
  }

  prev() {
    this.organisationsService.setOrganisationsPaginated(
      this.organisationsService.getOrganisationsStart() - 16,
      this.organisationsService.getOrganisationsEnd() - 16
    );
    this.notificationRef = this.notificationService.open(ToastComponent, {
      data: {
        text: `Showing ${this.start + 1} - ${
          this.end
        } of ${this.organisationsService.getOrganisationsLength()} organisations!`,
        type: 'success',
      },
      delay: 3000,
      stacking: true,
      position: 'top-right',
      autohide: true,
    });

    this.speechSynthesisService.speak({
      text: `Showing ${this.start + 1} - ${
        this.end
      } of ${this.organisationsService.getOrganisationsLength()} organisations!`,
    });
  }
}
