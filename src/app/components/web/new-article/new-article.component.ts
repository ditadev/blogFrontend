import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NewBlogPost } from 'src/app/models/newBlogPost';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/http/api.service';

@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.css'],
  animations: [
    trigger('disabled', [
      state('true', style({ opacity: 0.5, pointerEvents: 'none' })),
      state('false', style({ opacity: 1, pointerEvents: 'auto' })),
      transition('true <=> false', animate('200ms ease-in-out'))
    ])
  ]
})
export class NewArticleComponent implements OnInit, OnDestroy {

  subscription?: Subscription;
  selectedFile!: File;
  _article!: NewBlogPost;
  _showMore: boolean = false;
  msg: string = "";
  newBlogPostForm!: FormGroup;
  message: string = "";

  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this._article = {} as NewBlogPost;
    this.newBlogPostForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      summary: ['', [Validators.required, Validators.minLength(20)]],
      body: ['', [Validators.required, Validators.minLength(100)]],
      tags: ['', [Validators.required, Validators.minLength(6)]],
      categoryName: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addPost() {
    if (this.newBlogPostForm.valid) {
      this._article = { ...this.newBlogPostForm.value };
      this.spinner.show();
      this.subscription = this.apiService.postArticle(this.selectedFile, this._article)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.msg = response.message;
            if (response.code == 0) {
              this._showMore = !this._showMore;
            }
            this.spinner.hide();
          },
          error: (error) => {
            this.message = "Image Required";
            this.spinner.hide();
          },
          complete: () => {
            this.spinner.hide();
          }
        });
    } else {
      this.message = 'Please fill in all required fields';
    }
  }

  onSubmit(): void {
    this.addPost();
  }


  closeDialog(): void {
    this._showMore = !this._showMore;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
