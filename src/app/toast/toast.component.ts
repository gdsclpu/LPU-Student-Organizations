import { Component, OnInit } from '@angular/core';
import { MdbNotificationRef } from 'mdb-angular-ui-kit/notification';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  text: string | null = null;
  type: string = '';

  constructor(public notificationRef: MdbNotificationRef<ToastComponent>) {}

  ngOnInit(): void {}
}
