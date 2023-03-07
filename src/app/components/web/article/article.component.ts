import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogPost } from 'src/app/models/blogPost';
import { PageInfo } from 'src/app/models/pageInfo';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ApiService } from 'src/app/services/http/api.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
  animations: [
    trigger('disabled', [
      state('true', style({ opacity: 0.5, pointerEvents: 'none' })),
      state('false', style({ opacity: 1, pointerEvents: 'auto' })),
      transition('true <=> false', animate('200ms ease-in-out'))
    ])
  ]
})
export class ArticleComponent implements OnInit, OnDestroy {
  
  subscription?: Subscription;
  _postId = this.route.snapshot.paramMap.get('postId')!;
  articles!: BlogPost;
  pageInfo!:PageInfo;
  postId:number=parseInt(this._postId);
  currentPage = 1;
  pageSize = 10;
  

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.articles = {} as BlogPost;
    this.spinner.show(); // show the spinner before making API call
    this.getArticle(); 
  }

  getArticle(): void {
    this.spinner.show();
    this.subscription = this.apiService.getArticle(this.postId).subscribe({
      next: (response) => {
        this.pageInfo = response.pageInfo;
        this.articles = response.data;
      },
      error: (error) => {
        this.spinner.hide();
        this.router.navigate(['my-articles']);
        console.log(error);
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }

  downloadPDF() {
    const element = document.getElementById('contentToConvert');
    if (element) {
      html2canvas(element, { useCORS: true, allowTaint: true }).then(canvas => {
        const contentWidth = canvas.width;
        const contentHeight = canvas.height;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const position = 0;
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = contentHeight / contentWidth;
        const height = pdfWidth * ratio;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, height);
        pdf.save('file.pdf');
      });
    }
  }  

  goBack():void{
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
