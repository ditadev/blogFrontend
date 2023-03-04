import { Component, OnDestroy, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { BlogPost } from 'src/app/models/blogPost';
import { Router } from '@angular/router';
import { PageInfo } from 'src/app/models/pageInfo';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-my-articles',
  templateUrl: './my-articles.component.html',
  styleUrls: ['./my-articles.component.css'],
  animations: [
    trigger('disabled', [
      state('true', style({ opacity: 0.5, pointerEvents: 'none' })),
      state('false', style({ opacity: 1, pointerEvents: 'auto' })),
      transition('true <=> false', animate('200ms ease-in-out'))
    ])
  ]
})
export class MyArticlesComponent implements OnInit, OnDestroy {
  id!:number;
  subscription?: Subscription;
  articles:BlogPost[]=[];
  pageInfo!: PageInfo;
  currentPage!:number;
  pageSize = 12;
  totalPages = 0;
  hasNext!:boolean;
  hasPrevious!:boolean;
  selectedArticlePage!:number;

  constructor(
    private jwtHelper: JwtHelperService, 
    private apiService:ApiService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(){
    const token = localStorage.getItem("jwt");
    if (token) {
      this.id = this.jwtHelper.decodeToken(token).sub;
    } else {
      this.router.navigate(["login"]);
    } 
   this.getArticlesByAuthor();
  }

  getArticlesByAuthor():void{
    this.spinner.show(); // show the spinner before making API call
    this.subscription = this.apiService
    .getArticlesByAuthor(this.id,this.currentPage,this.pageSize)
    .subscribe(
      response => {
        this.articles = response.data;
        this.pageInfo = response.pageInfo;
        this.totalPages = response.pageInfo.totalPages;
        this.currentPage = response.pageInfo.currentPage;
        this.pageSize = response.pageInfo.pageSize;
        this.hasNext = response.pageInfo.hasNext;
        this.hasPrevious = response.pageInfo.hasPrevious;
        this.spinner.hide(); // hide the spinner when API call is successful
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

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getArticlesByAuthor();
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getArticlesByAuthor();
    }
  }
  

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
