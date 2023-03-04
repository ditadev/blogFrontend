import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { Login } from 'src/app/models/login';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, OnDestroy {

  _login!:Login;
  subscription?: Subscription;
  code?:number;
  jwt!:string;
  message:string="";

  constructor(
    private apiService: ApiService,
    private jwtHelper: JwtHelperService, 
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this._login = {} as Login;
  }

  login(): void {
    this.spinner.show();
    this.subscription = this.apiService.login(this._login).subscribe({
      next: (response) => {
        this.code = response.code;
        this.jwt = response.data.accessToken;
        localStorage.setItem('jwt', this.jwt);
        if (this.code == 0) {
          this.router.navigate(['feeds']);
        }
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        this.message = 'Error Message';
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }
  

  isUserAuthenticated() {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    else {
      return false;
    }
  }

  public logOut = () => {
    localStorage.removeItem("jwt");
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
