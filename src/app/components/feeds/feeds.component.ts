import { Component, OnDestroy, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { BlogPost } from 'src/app/models/blogPost';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent implements OnInit, OnDestroy  {

  id!:number;
  name!:string;
  subscription?: Subscription;
  articles:BlogPost[]=[];

  constructor(
    private jwtHelper: JwtHelperService, 
    private apiService:ApiService,
    private router: Router
  ) {}

  ngOnInit(){
    this.subscription = this.apiService
    .getArticles()
    .subscribe(
      response => {
        this.articles = response.data;
    });
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}