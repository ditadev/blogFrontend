import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent   {
  id!:number;
  name!:string;
  constructor(
    private jwtHelper: JwtHelperService, 
    private apiService:ApiService
  ) {}

  isUserAuthenticated() {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.id=this.jwtHelper.decodeToken(token).sub;
      this.apiService.getUser(this.id).subscribe(response=>{
        this.name=response.data.username
      });
      console.log(name);
      return true;
    }
    else {
      return false;
    }
  }
}
