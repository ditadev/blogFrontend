import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { Login } from 'src/app/models/login';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from 'src/app/models/blogPost';
import { parse } from 'postcss';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit, OnDestroy {
  
  subscription?: Subscription;
  _postId = this.route.snapshot.paramMap.get('postId')!;
  articles!: BlogPost[] ;
  postId:number=parseInt(this._postId);

  constructor(
    private apiService: ApiService,
    private jwtHelper: JwtHelperService, 
    private router: Router,
    private route: ActivatedRoute,

  ) {}

  ngOnInit(): void {
    this.getAgency(); 
  }

  getAgency(): void {
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
