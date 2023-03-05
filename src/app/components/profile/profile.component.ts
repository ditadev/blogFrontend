import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
updateUserForm!: FormGroup;
changeEmailForm!: FormGroup;
verifyEmailChangeForm!: FormGroup;
changePasswordForm!: FormGroup;



constructor(
  private apiService: ApiService,
  private jwtHelper: JwtHelperService, 
  private router: Router,
  private spinner: NgxSpinnerService,
  private formBuilder: FormBuilder
) {}

ngOnInit(): void {
  this.author = {} as UpdateAuthor;
  this.emailChange = {} as ChangeEmail;
  this.verifyEmailChange = {} as VerifyChangeEmail;
  this.changePasswordRequest = {} as ChangePassword;
  this.token="";

  this.getUser()

  this.updateUserForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    userName: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(100)]]
  });

  this.changeEmailForm = this.formBuilder.group({
    oldEmailAddress: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  this.verifyEmailChangeForm = this.formBuilder.group({
    token: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    oldEmailAddress: ['', [Validators.required, Validators.email]],
    newEmailAddress: ['', [Validators.required, Validators.email]],
  });

  this.changePasswordForm = this.formBuilder.group({
    emailAddress: ['', [Validators.required, Validators.email]],
    oldPassword: ['', [Validators.required, Validators.minLength(8)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8), this.matchPasswords.bind(this)]],
  });
}

matchPasswords(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.parent?.get('password');
  const confirmPassword = control.parent?.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { 'passwordMismatch': true };
  }
  return null;
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
  if (this.changeEmailForm.valid) {
    this.emailChange = { ...this.changeEmailForm.value };
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
      this.spinner.show();
      this.message = 'Incorrect email/password';
    },
    complete: () => {
      this.spinner.hide();
    },
  });
}
else {
  this.message = 'Please fill in all required fields';
}
}

verifyEmailChanger():void{
  if (this.changeEmailForm.valid) {
    this.token=this.verifyEmailChangeForm.value.token;
    this.verifyEmailChange.newEmailAddress=this.verifyEmailChangeForm.value.newEmailAddress;
    this.verifyEmailChange.oldEmailAddress=this.verifyEmailChangeForm.value.oldEmailAddress;
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
      this.spinner.show();
      this.message = 'Check entry and try again';
    },
    complete: () => {
      this.spinner.hide();
    },
  });
}
  else {
    this.message = 'Please fill in all required fields';
  }
}

updateAuthor():void{
  if (this.updateUserForm.valid) {
    this.author = { ...this.updateUserForm.value };
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
      this.spinner.show();
      this.message = 'Username already Exists';
    },
    complete: () => {
      this.spinner.hide();
    },
  });
}
else {
  this.message = 'Please fill in all required fields';
}
}

changePassword():void{
  if (this.changePasswordForm.valid) {
    this.changePasswordRequest = { ...this.changePasswordForm.value };
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
      this.spinner.show();
      this.message = 'Error Message';
    },
    complete: () => {
      this.spinner.hide();
    },
  });
}else {
  this.message = 'Please fill in all required fields';
}
}

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
  this.spinner.show();
  window.location.href = window.location.href;
}

ngOnDestroy(): void {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
}
}
