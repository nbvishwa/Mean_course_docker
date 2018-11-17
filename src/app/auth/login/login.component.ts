import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading = false;
  constructor(private authService: AuthService, private nav: Router) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    this.authService.loginUser(form.value.email, form.value.password)
    .subscribe( response => {
      this.isLoading = false;
      this.nav.navigateByUrl('/');
    }, error => {
      this.isLoading = false;
    });
    // this.authService.getAuthStatusListner().subscribe(isAuthenticated => {
    //   if (isAuthenticated) {

    //   }
    // });
  }

}
