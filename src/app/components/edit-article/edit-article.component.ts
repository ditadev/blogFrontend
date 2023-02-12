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

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.getArticle(); 
    console.log("This post id "+this.postId);
  }

  updateArticle(){
    this.subscription =this.apiService.updateArticle(this.postId,this._article).subscribe(response=>{
      console.log(response);
      console.log(this._article);
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


  onFileChange(event:any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this._article.coverImagePath = reader.result as string;
      };
    }
  }
  

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
