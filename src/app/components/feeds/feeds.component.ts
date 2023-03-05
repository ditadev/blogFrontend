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
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css'],
  animations: [
    trigger('disabled', [
      state('true', style({ opacity: 0.5, pointerEvents: 'none' })),
      state('false', style({ opacity: 1, pointerEvents: 'auto' })),
      transition('true <=> false', animate('200ms ease-in-out'))
    ])
  ]
})
export class FeedsComponent implements OnInit, OnDestroy {

  subscription?: Subscription;
  pageInfo!: PageInfo;
  articles: BlogPost[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  hasNext!:boolean;
  hasPrevious!:boolean;


  constructor(
    private jwtHelper: JwtHelperService,
    private apiService: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.pageInfo = {} as PageInfo;
    this.getArticles();
  }

  getArticles(): void {
    this.spinner.show(); // show the spinner before making API call
    this.subscription = this.apiService
      .getArticles(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.articles = response.data;
          this.pageInfo = response.pageInfo;
          this.totalPages = response.pageInfo.totalPages;
          this.hasNext = response.pageInfo.hasNext;
          this.hasPrevious = response.pageInfo.hasPrevious;
          this.spinner.hide(); // hide the spinner when API call is successful
        },
        error: (error) => {
          this.spinner.show(); // hide the spinner when API call is successful
        },
        complete: () => {
          this.spinner.hide(); // hide the spinner when API call is successful
        }
      });
  }


  previousPage() {
    if (this.pageInfo.currentPage > 1) {
      this.currentPage--;
      this.getArticles();
    }
  }

  nextPage() {
    if (this.currentPage < this.pageInfo.totalPages) {
      this.currentPage++;
      this.getArticles();
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
