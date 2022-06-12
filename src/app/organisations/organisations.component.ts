import { Component, NgZone, OnInit } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { IOrganisations, OrganisationsService } from '../organisations.service';

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

  constructor(
    private modalService: MdbModalService,
    private organisationsService: OrganisationsService,
    private ngZone: NgZone
  ) {
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
  }

  next() {
    this.organisationsService.setOrganisationsPaginated(
      this.organisationsService.getOrganisationsStart() + 16,
      this.organisationsService.getOrganisationsEnd() + 16
    );
  }

  prev() {
    this.organisationsService.setOrganisationsPaginated(
      this.organisationsService.getOrganisationsStart() - 16,
      this.organisationsService.getOrganisationsEnd() - 16
    );
  }
}
