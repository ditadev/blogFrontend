import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, UrlHandlingStrategy } from '@angular/router';
import { BlogPost } from 'src/app/models/blogPost';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { NewBlogPost } from 'src/app/models/newBlogPost';

@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.css']
})
export class NewArticleComponent implements OnInit, OnDestroy{
  
  subscription?: Subscription;
 _article!:NewBlogPost;
 url: any; 
msg = "";

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

postArticle(){
  this.subscription=this.apiService.postArticle(this.url,this._article).subscribe(
    response=>{
        console.log(response);
    }
  );
}

ngOnInit(): void {
  this._article = {} as NewBlogPost;
}
//selectFile(event) { //Angular 8
selectFile(event: any) { //Angular 11, for stricter type
  if(!event.target.files[0] || event.target.files[0].length == 0) {
    this.msg = 'You must select an image';
    return;
  }
  
  var mimeType = event.target.files[0].type;
  
  if (mimeType.match(/image\/*/) == null) {
    this.msg = "Only images are supported";
    return;
  }
  
  var reader = new FileReader();
  reader.readAsDataURL(event.target.files[0]);
  
  reader.onload = (_event) => {
    this.msg = "";
    this.url = reader.result; 
    console.log(this.url);
  }
  this._article.coverImage=this.url;
  console.log(`Cover Image ===>> ${this._article.coverImage}`);
}

async NselectFile(event: any) { // changed to async
  if (!event.target.files[0] || event.target.files[0].length === 0) {
    this.msg = 'You must select an image';
    return;
  }
  
  const file = event.target.files[0];
  const mimeType = file.type;
  
  if (!mimeType.startsWith('image/')) {
    this.msg = "Only images are supported";
    return;
  }
  
  try {
    const response = await fetch(URL.createObjectURL(file));
    const stream = response.body;
    console.log(`Cover Image ===>> ${stream}`);
    return stream;
  } catch (error) {
    console.error(error);
    this.msg = "Error loading file";
    return;
  }
}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
