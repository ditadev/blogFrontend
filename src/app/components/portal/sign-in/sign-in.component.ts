import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Login } from 'src/app/models/login';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/http/api.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  animations: [
    trigger('disabled', [
      state('true', style({ opacity: 0.5, pointerEvents: 'none' })),
      state('false', style({ opacity: 1, pointerEvents: 'auto' })),
      transition('true <=> false', animate('200ms ease-in-out'))
    ])
  ]
})
export class SignInComponent implements OnInit, OnDestroy {

  _login!: Login;
  subscription?: Subscription;
  code?: number;
  jwt!: string;
  message: string = "";
  loginForm!: FormGroup;

  constructor(
    private apiService: ApiService,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this._login = {} as Login;
    this.loginForm = this.formBuilder.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this._login = { ...this.loginForm.value };
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
          this.loginForm.reset();
          this.message = 'Error Message';
        },
        complete: () => {
          this.spinner.hide();
        },
      });
    } else {
      this.message = 'Please fill in all required fields';
    }
  }

  onSubmit(): void {
    this.login();
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
