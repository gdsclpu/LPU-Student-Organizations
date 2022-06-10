import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public email: string = '';
  public password: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  login(email: string, password: string) {
    this.authService.login(email, password);
  }

  onSubmit(formData: NgForm) {
    if (formData.valid) {
      this.login(formData.value.email, formData.value.password);
    }
  }
}
