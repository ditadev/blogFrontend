import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { BlogPost } from 'src/app/models/blogPost';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnDestroy  {

  subscription?: Subscription;

  _article1!:BlogPost;
  _article2!:BlogPost;
  _article3!:BlogPost;

  constructor(
    private apiService:ApiService,
  ) {}

  ngOnInit(){
    this.subscription = this.apiService
    .getArticles()
    .subscribe(
      response => {
        this._article1 = response.data[0];
        this._article2 = response.data[1];
        this._article3 = response.data[2];
        console.log(this._article1,this._article2,this._article3)
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
