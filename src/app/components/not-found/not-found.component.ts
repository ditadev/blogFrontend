import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {

  constructor(
    private location: Location,
    private jwtHelper: JwtHelperService,
    private router: Router,
  ) {}

  goBack():void{
   const response:boolean = this.isUserAuthenticated();
   if (response == true){
    this.router.navigate(["feeds"]);
   }else{
   this.router.navigate([""]);
   }
  }

  isUserAuthenticated() {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    else {
      this.router.navigate(["login"]);
      return false;
    }
  }
}
