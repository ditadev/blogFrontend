import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { BlogPost } from 'src/app/models/blogPost';
import { PageInfo } from 'src/app/models/pageInfo';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnDestroy  {

  subscription?: Subscription;
  pageInfo!:PageInfo;
  _article1!:BlogPost;
  _article2!:BlogPost;
  _article3!:BlogPost;
  currentPage = 1;
  pageSize = 3;

  constructor(
    private apiService:ApiService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show(); // show the spinner before making API call
    this.subscription = this.apiService.getArticles(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this._article1 = response.data[0];
        this._article2 = response.data[1];
        this._article3 = response.data[2];
        console.log(response);
      },
      error: (err) => {
        console.log(err);
        this.spinner.hide(); // hide the spinner on error
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
