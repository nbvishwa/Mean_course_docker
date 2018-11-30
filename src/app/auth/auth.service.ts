import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authTokenStatus = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;
  private userId: string;

  constructor(private http: HttpClient, private router: Router) {

  }

  getToken() {
    return this.token;
  }

  getAuthStatusListner() {
    return this.authTokenStatus.asObservable();
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  createUser(email: string, password: string, name: string) {
    const authData:  AuthData = {email: email, password: password, name: name};
    return this.http.post('http://192.168.0.136:3000:3000/api/user/signup', authData);
  }

  loginUser(email: string, password: string) {
     return this.http.post<{message: string, token: string, expiresIn: number, userId: string}>('http://192.168.0.136:3000:3000/api/user/login',
    { email: email, password: password })
    .pipe( map(response => {
      const expiresInDuration = response.expiresIn;
      this.setAuthTimer(expiresInDuration);
      this.token = response.token;
      const now = new Date();
      const expDate = new Date(now.getTime() + expiresInDuration * 3600);
      this.saveAuthData(this.token, expDate, response.userId);
      if (this.token) {
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authTokenStatus.next(true);
      }
      return this.isAuthenticated;
    }, error => {
      return false;
    }));
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authTokenStatus.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.authTokenStatus.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expDate', expDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expDate');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expDate = localStorage.getItem('expDate');
    const userId = localStorage.getItem('userId');
    if (!token || !expDate) {
      return;
    }
    return {
      token: token,
      expDate: new Date(expDate),
      userId: userId
    };
  }

}
