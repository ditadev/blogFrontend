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
  postId:number=parseInt(this._postId);
 _article!:BlogPost;
 selectedFile!: File;
 _showMore:boolean=false;
 msg = "";


  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getArticle(); 
    console.log("This post id "+this.postId);
  }

  closeDialog(){
    this._showMore=!this._showMore;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  updateArticle(){
    this.subscription =this.apiService.updateArticle(this.selectedFile,this.postId,this._article).subscribe(response=>{
      console.log(response);
      this.msg=response.message;
      console.log(this._article);
      if(response.code==0){
        this._showMore=!this._showMore;
        }
    })
  }

  getArticle(){
    this.subscription = this.apiService
    .getArticle(this._postId)
    .subscribe(
      response => {
        this._article = response.data;
    });
  }
  

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
