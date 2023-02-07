import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from 'src/app/models/blogPost';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit, OnDestroy{

  subscription?: Subscription;
  _postId = this.route.snapshot.paramMap.get('postId')!;
  articles!: BlogPost[] ;
  postId:number=parseInt(this._postId);
  _showMore:boolean=false;
_article!:BlogPost;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.getArticles(); 
    console.log("This post id "+this.postId);
  }

  updateArticle(){
    this.subscription =this.apiService.updateArticle(this.articles.find((obj)=>{return obj.postId===this.postId}),this._article).subscribe(response => {
      console.log(response);
})
  }

  getArticle(){
    this.subscription = this.apiService
    .getArticles()
    .subscribe(
      response => {
        this.articles = response.data;
    });
  }

  getArticles(): void {
    this.subscription = this.apiService
    .getArticles()
    .subscribe(
      response => {
        this.articles = response.data;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
