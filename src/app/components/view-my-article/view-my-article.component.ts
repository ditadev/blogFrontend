import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from 'src/app/models/blogPost';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-my-article',
  templateUrl: './view-my-article.component.html',
  styleUrls: ['./view-my-article.component.css'],
  animations: [
    trigger('disabled', [
      state('true', style({ opacity: 0.5, pointerEvents: 'none' })),
      state('false', style({ opacity: 1, pointerEvents: 'auto' })),
      transition('true <=> false', animate('200ms ease-in-out'))
    ])
  ]
})
export class ViewMyArticleComponent implements OnInit, OnDestroy {

  subscription?: Subscription;
  _postId = this.route.snapshot.paramMap.get('postId')!;
  articles!: BlogPost;
  postId: number = parseInt(this._postId);
  _showMore: boolean = false;
  currentPage = 1;
  pageSize = 10;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.getArticles();
  }

  getArticles(): void {
    this.spinner.show(); // show the spinner before making API call
    this.subscription = this.apiService.getArticle(this.postId).subscribe(
      response=>{
        this.articles=response.data;
        this.spinner.hide(); // hide the spinner when API call is successful
      }
    )
  }

  deleteArticle() {
    this.spinner.hide(); // hide the spinner when API call is successful
    this.subscription = this.apiService
      .deleteArticle(this.postId)
      .subscribe(
        response => {
          this.spinner.hide(); // hide the spinner when API call is successful
        });
    setTimeout(() => {
      this.router.navigate(["my-article"]);
    }, 500);
  }

  confirmDelete() {
    this._showMore = !this._showMore;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
