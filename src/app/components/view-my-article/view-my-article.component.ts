import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from 'src/app/models/blogPost';
import { Router } from '@angular/router';
import { PageInfo } from 'src/app/models/pageInfo';

@Component({
  selector: 'app-view-my-article',
  templateUrl: './view-my-article.component.html',
  styleUrls: ['./view-my-article.component.css']
})
export class ViewMyArticleComponent implements OnInit, OnDestroy{
  
  subscription?: Subscription;
  _postId = this.route.snapshot.paramMap.get('postId')!;
  articles!: BlogPost[] ;
  postId:number=parseInt(this._postId);
  _showMore:boolean=false;
  pageInfo!:PageInfo;
  currentPage = 1;
  pageSize = 10;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.getArticles(); 
    console.log("This post id "+this.postId);
  }

  getArticles(): void {
    this.subscription = this.apiService
    .getArticles(this.currentPage,this.pageSize)
    .subscribe(
      response => {
        this.pageInfo = response.pageInfo;
        this.articles = response.data;
    });
  }

  deleteArticle(){
    this.subscription = this.apiService
    .deleteArticle(this.postId)
    .subscribe(
      response => {console.log(response);
    });
    setTimeout(() => {
      this.router.navigate(["my-article"]);
    }, 500);  }

  confirmDelete(){
    this._showMore=!this._showMore;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
