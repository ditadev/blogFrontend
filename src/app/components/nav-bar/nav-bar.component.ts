import { Component, OnDestroy, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
    private router: Router
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
    this.subscription=this.apiService.getUser(this.id).subscribe(response=>{
      this.name=response.data.username;
      console.log(this.name);
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
