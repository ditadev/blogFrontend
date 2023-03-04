import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from 'src/app/models/blogPost';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css'],
  animations: [
    trigger('disabled', [
      state('true', style({ opacity: 0.5, pointerEvents: 'none' })),
      state('false', style({ opacity: 1, pointerEvents: 'auto' })),
      transition('true <=> false', animate('200ms ease-in-out'))
    ])
  ]
})
export class EditArticleComponent implements OnInit, OnDestroy{

  subscription?: Subscription;
  _postId = this.route.snapshot.paramMap.get('postId')!;
  postId:number=parseInt(this._postId);
 _article!:BlogPost;
 selectedFile!: File;
 _showMore:boolean=false;
 msg: string = "";


  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this._article={} as BlogPost;
    this.spinner.show(); // show the spinner before making API call
    this.getArticle(); 
    console.log("This post id "+this.postId);
  }

  closeDialog(){
    this._showMore=!this._showMore;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  updateArticle(): void {
    this.spinner.show(); // show the spinner before making API call
    this.subscription = this.apiService.updateArticle(this.selectedFile, this.postId, this._article).subscribe({
      next: (response) => {
        console.log(response);
        this.msg = response.message;
        console.log(this._article);
        if (response.code == 0) {
          this.spinner.hide(); // hide the spinner when API call is successful
          this._showMore = !this._showMore;
        }
      },
      error: (error) => {
        this.msg = "Required";
        this.spinner.hide(); // hide the spinner when API call is successful
      },
      complete: () => {
        this.spinner.hide(); // hide the spinner when API call is successful
      }
    });
  }
  

  getArticle(){
    this.spinner.show(); // show the spinner before making API call
    this.subscription = this.apiService
    .getArticle(this._postId)
    .subscribe(
      response => {
        this.spinner.hide(); // hide the spinner when API call is successful
        this._article = response.data;
    });
  }
  

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
