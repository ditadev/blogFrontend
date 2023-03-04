import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { NewBlogPost } from 'src/app/models/newBlogPost';
import { NgxSpinnerService } from 'ngx-spinner';

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
  msg: string = "";

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) { }


  ngOnInit(): void {
    this._article = {} as NewBlogPost;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addPost() {
    this.spinner.show(); // show the spinner before making API call
    this.subscription=this.apiService.postArticle(this.selectedFile,this._article).subscribe(
      response=>{
        console.log(response);
        this.msg=response.message;
        if(response.code==0){
          this._showMore=!this._showMore;
          }
          this.spinner.hide(); // show the spinner before making API call
      },
      error => {
        this.msg="Required";
        this.spinner.hide(); // hide the spinner when API call is successful
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
