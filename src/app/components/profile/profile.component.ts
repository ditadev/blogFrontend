import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ChangeEmail } from 'src/app/models/changeEmail';
import { UpdateAuthor } from 'src/app/models/updateAuthor';
import { VerifyChangeEmail } from 'src/app/models/verifyEmailChange';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

state:number=1;
author!:UpdateAuthor;
emailChange!:ChangeEmail;
verifyEmailChange!:VerifyChangeEmail;
subscription?: Subscription;
code!:number;
message:string="";
id!:number;
token!:string;



ngOnInit(): void {
  this.author = {} as UpdateAuthor;
  this.emailChange = {} as ChangeEmail;
  this.verifyEmailChange = {} as VerifyChangeEmail;
  this.token="";
  this.getUser()
}

constructor(
  private apiService: ApiService,
  private jwtHelper: JwtHelperService, 
  private router: Router,
  private spinner: NgxSpinnerService,
) {}


profile():void{
  this.state=2;
}
changePassword():void{
  this.state=3;
}
changeEmail():void{
  this.state=4;
}
changeEmails():void{
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
    console.log(this.author);
    this.spinner.hide();
  });
}

changeEmailw():void{
  this.spinner.show();
  this.subscription = this.apiService.changeEmail(this.emailChange.oldEmailAddress,this.emailChange.password).subscribe({
    next: (response) => {
      this.code = response.code;
      if (this.code == 0) {
        this.changeEmails();
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

ngOnDestroy(): void {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
}
}
