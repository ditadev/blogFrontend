import { Component, OnDestroy, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/http/api.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy{

  subscription?: Subscription;
  id!:number;
  name!:string;
  _showMore:boolean=false;

  constructor(
    private jwtHelper: JwtHelperService, 
    private apiService:ApiService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
  this.getUser();
  }

  getUser():void{
    const token = localStorage.getItem("jwt");
    if (token) {
      this.id = this.jwtHelper.decodeToken(token).sub;
    } else {
      this.router.navigate(["login"]);
    }
    this.spinner.show();
    this.subscription = this.apiService.getUser(this.id).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.name = response.data.username;
      },
      error: (error) => {
        this.spinner.hide();
        console.error(error);
        this.router.navigate([""]);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }
  

  showMore(){
    this._showMore=!this._showMore;
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

  logOut(){
    localStorage.removeItem("jwt");
    this.router.navigate(["login"]);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
