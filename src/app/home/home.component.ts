import { Component, OnInit } from '@angular/core';

import { ModalComponent } from '../modal/modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  modalRef: MdbModalRef<ModalComponent> | null = null;

  constructor(private modalService: MdbModalService) {}

  ngOnInit(): void {
  }

  showDetails() {
    this.modalRef = this.modalService.open(ModalComponent)
  }

}
