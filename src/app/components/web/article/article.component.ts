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
      const pdf = new jsPDF('p', 'pt', 'a4');
      const options = {
        useCORS: true,
        allowTaint: true,
        scale: 1,
        logging: true,
        width: element.offsetWidth,
        height: element.offsetHeight,
        scrollX: 0,
        scrollY: -window.scrollY
      };
      html2canvas(element, options).then((canvas) => {
        const contentHeight = canvas.height;
        const pageHeight = 1611;
        const pageCount = Math.ceil(contentHeight / pageHeight);
        for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
          const position = pageIndex * pageHeight * -1;
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = pageHeight - 2;
          const context = pageCanvas.getContext('2d');
          if (context) {
            context.fillStyle = '#fff';
            context.fillRect(0, 0, pageCanvas.width, 30);
            context.drawImage(canvas, 0, position + 30); 
            const imgData = pageCanvas.toDataURL('image/png');
            const imgWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (pageCanvas.height * imgWidth) / pageCanvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            if (pageIndex < pageCount - 1) {
              pdf.addPage();
              pdf.setFillColor(255, 255, 255);
              pdf.rect(0, pdf.internal.pageSize.getHeight() - 30, pdf.internal.pageSize.getWidth(), 30, 'F'); 
            }
            if (pageIndex === pageCount - 1) {
              pdf.save('file.pdf');
            }
          }
        }
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
