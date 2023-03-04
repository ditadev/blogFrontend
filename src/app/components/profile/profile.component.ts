import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ChangeEmail } from 'src/app/models/changeEmail';
import { ChangePassword } from 'src/app/models/changePassword';
import { UpdateAuthor } from 'src/app/models/updateAuthor';
import { VerifyChangeEmail } from 'src/app/models/verifyEmailChange';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('disabled', [
      state('true', style({ opacity: 0.5, pointerEvents: 'none' })),
      state('false', style({ opacity: 1, pointerEvents: 'auto' })),
      transition('true <=> false', animate('200ms ease-in-out'))
    ])
  ]
})
export class ProfileComponent implements OnInit, OnDestroy {

state:number=1;
author!:UpdateAuthor;
emailChange!:ChangeEmail;
verifyEmailChange!:VerifyChangeEmail;
changePasswordRequest!:ChangePassword;
subscription?: Subscription;
code!:number;
message:string="";
id!:number;
token!:string;



ngOnInit(): void {
  this.author = {} as UpdateAuthor;
  this.emailChange = {} as ChangeEmail;
  this.verifyEmailChange = {} as VerifyChangeEmail;
  this.changePasswordRequest = {
    emailAddress: "",
    oldPassword: "",
    password: "",
    confirmPassword: ""
  };
  this.token="";
  this.getUser()
}

constructor(
  private apiService: ApiService,
  private jwtHelper: JwtHelperService, 
  private router: Router,
  private spinner: NgxSpinnerService,
) {}

updateProfileState():void{
  this.state=2;
}
changePasswordState():void{
  this.state=3;
}
changeEmailState():void{
  this.state=4;
}
verifyEmailChangeState():void{
  this.state=5;
}
back():void{
  window.location.href = window.location.href;
}

getUser():void{
  this.spinner.show();
  const token = localStorage.getItem("jwt");
  if (token) {
    this.id = this.jwtHelper.decodeToken(token).sub;
  } else {
    this.router.navigate(["login"]);
  }    
  this.subscription=this.apiService.getUser(this.id).subscribe(response=>{
    this.author.firstName=response.data.firstName;
    this.author.lastName=response.data.lastName;
    this.author.username=response.data.username;
    this.author.description=response.data.description;
    this.spinner.hide();
  });
}

changeEmailAddress():void{
  this.spinner.show();
  this.subscription = this.apiService.changeEmail(this.emailChange.oldEmailAddress,this.emailChange.password).subscribe({
    next: (response) => {
      this.code = response.code;
      if (this.code == 0) {
        this.verifyEmailChangeState();
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

verifyEmailChanger():void{
  this.spinner.show();
  this.subscription = this.apiService.verifyChangeEmail(this.token,this.verifyEmailChange).subscribe({
    next: (response) => {
      this.code = response.code;
      if (this.code == 0) {
        window.location.href = window.location.href;
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

updateAuthor():void{
  this.spinner.show();
  this.subscription = this.apiService.updateAuthur(this.author).subscribe({
    next: (response) => {
      this.code = response.code;
      if (this.code == 0) {
        window.location.href = window.location.href;
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

changePassword():void{
  this.spinner.show();
  this.subscription = this.apiService.changePassword(this.changePasswordRequest).subscribe({
    next: (response) => {
      this.code = response.code;
      if (this.code == 0) {
        this.router.navigate(["login"]);
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

ngOnDestroy(): void {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
}
}
