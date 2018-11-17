import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authListnerSubs: Subscription;
  public userAuthenticated = false;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.userAuthenticated = this.authService.getAuthStatus();
    this.authListnerSubs = this.authService.getAuthStatusListner().subscribe( isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authListnerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
