import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;
  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  onSignup(signupForm: NgForm) {
    this.isLoading = true;
    this.authService.createUser(signupForm.value.email, signupForm.value.password, signupForm.value.name)
    .subscribe(response => {
      this.isLoading = false;
      this.router.navigate(['/']);
    }, error => {
      this.isLoading = false;
    });
  }

}
