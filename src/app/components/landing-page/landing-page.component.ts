import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { BlogPost, Category } from 'src/app/models/blogPost';
import { PageInfo } from 'src/app/models/pageInfo';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  animations: [
    trigger('disabled', [
      state('true', style({ opacity: 0.5, pointerEvents: 'none' })),
      state('false', style({ opacity: 1, pointerEvents: 'auto' })),
      transition('true <=> false', animate('200ms ease-in-out'))
    ])
  ]
})
export class LandingPageComponent implements OnDestroy {

  subscription?: Subscription;
  pageInfo!: PageInfo;
  _article1!: BlogPost;
  _article2!: BlogPost;
  _article3!: BlogPost;
  currentPage = 1;
  pageSize = 3;

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this._article1 = {} as BlogPost;
    this._article1.category = {} as Category;
    this._article2 = {} as BlogPost;
    this._article2.category = {} as Category;
    this._article3 = {} as BlogPost;
    this._article3.category = {} as Category;
    this.getArticles();
  }

  getArticles(): void {
    this.spinner.show(); // show the spinner before making API call
    this.subscription = this.apiService.getArticles(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this._article1 = response.data[0];
        this._article2 = response.data[1];
        this._article3 = response.data[2];
        this.spinner.hide(); // hide the spinner on error
      },
      error: (err) => {
        console.log(err);
        this.spinner.show(); // hide the spinner on error
      },
      complete: () => {
        this.spinner.hide(); // hide the spinner when API call is completed
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
