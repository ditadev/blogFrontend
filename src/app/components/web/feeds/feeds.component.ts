import { Component, OnDestroy, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { BlogPost } from 'src/app/models/blogPost';
import { Router } from '@angular/router';
import { PageInfo } from 'src/app/models/pageInfo';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/http/api.service';

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
  hasNext!: boolean;
  hasPrevious!: boolean;
  dialog: number = 0;
  searchForm!: FormGroup;
  tag: string = "";
  message: string = "";
  search: number = 0;


  constructor(
    private jwtHelper: JwtHelperService,
    private apiService: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.pageInfo = {} as PageInfo;
    this.getArticles();
    this.searchForm = this.formBuilder.group({
      tag: ['', [Validators.required, Validators.minLength(1)]],
    });
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
          this.spinner.hide(); // hide the spinner when API call is successful
        },
        complete: () => {
          this.spinner.hide(); // hide the spinner when API call is successful
        }
      });
  }

  searchArticle(): void {
    this.spinner.show(); // show the spinner before making API call
    this.search = 1;
    this.subscription = this.apiService
      .searchArticle(this.tag, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.articles = response.data;
          this.pageInfo = response.pageInfo;
          this.totalPages = response.pageInfo.totalPages;
          this.hasNext = response.pageInfo.hasNext;
          this.hasPrevious = response.pageInfo.hasPrevious;
          this.spinner.hide(); // hide the spinner when API call is successful
          this.dialog = 1;
        },
        error: (error) => {
          this.message = "Enter search title";
          this.spinner.hide(); // hide the spinner when API call is successful
        },
        complete: () => {
          this.spinner.hide(); // hide the spinner when API call is successful
        }
      });
  }

  previousPage() {
    if (this.pageInfo.currentPage > 1) {
      this.currentPage--;
      if (this.search == 1) {
        this.searchArticle();
      } else {
        this.getArticles();
      }
    }
  }
  
  nextPage() {
    if (this.currentPage < this.pageInfo.totalPages) {
      this.currentPage++;
      if (this.search == 1) {
        this.searchArticle();
      } else {
        this.getArticles();
      }
    }
  }
  

  back(): void {
    this.spinner.show();
    window.location.href = window.location.href;
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
