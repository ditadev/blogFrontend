import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, UrlHandlingStrategy } from '@angular/router';
import { BlogPost } from 'src/app/models/blogPost';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { NewBlogPost } from 'src/app/models/newBlogPost';

@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.css']
})
export class NewArticleComponent implements OnInit, OnDestroy {

  subscription?: Subscription;
  selectedFile!: File;
  _article!: NewBlogPost;
  _showMore:boolean=false;
  msg = "";

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this._article = {} as NewBlogPost;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addPost() {
    this.subscription=this.apiService.postArticle(this.selectedFile,this._article).subscribe(
      response=>{
        console.log(response);
        this.msg=response.message;
        if(response.code==0){
          this._showMore=!this._showMore;
          }
      }
    )
  }
  
  closeDialog(){
    this._showMore=!this._showMore;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
