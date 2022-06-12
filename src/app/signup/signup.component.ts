import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
import {
  MdbNotificationRef,
  MdbNotificationService,
} from 'mdb-angular-ui-kit/notification';
import { ToastComponent } from '../toast/toast.component';
import { SpeechSynthesisService } from '../speech-synthesis.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  public email: string = '';
  public password: string = '';
  public rePassword = '';
  notificationRef: MdbNotificationRef<ToastComponent> | null = null;

  constructor(
    private authService: AuthService,
    private _location: Location,
    private notificationService: MdbNotificationService,
    private speechSynthesisService: SpeechSynthesisService
  ) {}

  ngOnInit(): void {}

  onSubmit = (formData: NgForm) => {
    if (formData.value.password === formData.value.rePassword) {
      this.authService.register(formData.value.email, formData.value.password);
    } else {
      this.speechSynthesisService.speak({
        text: 'Passwords do not match!',
      });
      this.notificationRef = this.notificationService.open(ToastComponent, {
        data: {
          text: 'Passwords do not match!',
          type: 'info',
        },
        position: 'top-right',
        delay: 5000,
        autohide: true,
        stacking: true,
      });
    }
  };

  loginWithGoogle() {
    this.authService.googleLogin();
  }

  goBack() {
    this._location.back();
  }
}
