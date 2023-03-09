import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BlogPost } from 'src/app/models/blogPost';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/http/api.service';

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
export class EditArticleComponent implements OnInit, OnDestroy {

  subscription?: Subscription;
  _postId = this.route.snapshot.paramMap.get('postId')!;
  postId: number = parseInt(this._postId);
  _article!: BlogPost;
  selectedFile!: File;
  _showMore: boolean = false;
  msg: string = "";
  message: string = "";
  editArticleForm!: FormGroup;
  filename:string="";


  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this._article = {} as BlogPost;
    this.spinner.show(); // show the spinner before making API call
    this.editArticleForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      summary: ['', [Validators.required, Validators.minLength(20)]],
      body: ['', [Validators.required,Validators.minLength(100), Validators.maxLength(30000)]],
      tags: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.getArticle();
  }

  closeDialog() {
    this._showMore = !this._showMore;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.filename=this.selectedFile.name;
  }

  updateArticle(): void {
    if (this.editArticleForm.valid) {
      this._article.title = this.editArticleForm.value.title;
      this._article.summary = this.editArticleForm.value.summary;
      this._article.body = this.editArticleForm.value.body;
      this._article.tags = this.editArticleForm.value.tags;
      this.spinner.show(); // show the spinner before making API call
      this.subscription = this.apiService.updateArticle(this.selectedFile, this.postId, this._article).subscribe({
        next: (response) => {
          this.msg = response.message;
          if (response.code == 0) {
            this.spinner.hide(); // hide the spinner when API call is successful
            this._showMore = !this._showMore;
          }
        },
        error: (error) => {
          this.message = "Image Required";
          this.spinner.hide(); // hide the spinner when API call is successful
        },
        complete: () => {
          this.spinner.hide(); // hide the spinner when API call is successful
        }
      });
    } else {
      this.message = 'Please fill in all required fields';
    }
  }

  onSubmit(): void {
    this.updateArticle();
  }

  getArticle() {
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
