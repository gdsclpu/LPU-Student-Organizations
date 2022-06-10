import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  public email: string = '';
  public password: string = '';
  public regNo: number = 0;

  constructor(private authService: AuthService, private _location: Location) {}

  ngOnInit(): void {}

  onSubmit = (formData: NgForm) => {
    this.authService.register(
      formData.value.email,
      formData.value.password,
      formData.value.regNo
    );
  };

  goBack() {
    this._location.back();
  }
}
