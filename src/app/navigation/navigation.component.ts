import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public currentUser: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getAuthStatusListener().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      const user: any = this.authService.getUser();
      if (user) {
        this.currentUser = user.displayName || user.email;
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  redirectToRegister() {
    this.router.navigate(['/signup']);
  }

  logout() {
    this.authService.logout();
  }
}
