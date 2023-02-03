import { Component, OnDestroy, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/models/article';
import { BlogPost } from 'src/app/models/blogPost';

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent implements OnDestroy  {

  id!:number;
  name!:string;
  subscription?: Subscription;
  articles:BlogPost[]=[];

  constructor(
    private jwtHelper: JwtHelperService, 
    private apiService:ApiService
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
      return false;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
