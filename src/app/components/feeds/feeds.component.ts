import { Component, OnDestroy, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent implements OnDestroy  {
  id!:number;
  name!:string;
  subscription?: Subscription;

  constructor(
    private jwtHelper: JwtHelperService, 
    private apiService:ApiService
  ) {}

  getUser():void{
    const token = localStorage.getItem("jwt");
    if (token) {
      this.id = this.jwtHelper.decodeToken(token).sub;
    } else {
      console.error("No token found in local storage.");
    }    
    this.subscription=this.apiService.getUser(this.id).subscribe(response=>{
      this.name=response.data.username;
      console.log(this.name);
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
