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
      // Create a new PDF document
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
      // Convert the HTML content to a canvas using html2canvas
      html2canvas(element, options).then((canvas) => {
        // Get the total height of the content
        const contentHeight = canvas.height;
        // Set the page height to 950 pixels (adjust as needed)
        const pageHeight = 1550;
        // Calculate the number of pages needed to display the content
        const pageCount = Math.ceil(contentHeight / pageHeight);
        // Loop through each page and add it to the PDF document
        for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
          // Calculate the y position of the page
          const position = pageIndex * pageHeight * -1;
          // Create a new canvas for the current page with padding at the top
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = pageHeight + 30; // add 30 pixels of padding at the top
          const context = pageCanvas.getContext('2d');
          if (context) {
            // Fill the canvas with white color to create the padding at the top
            context.fillStyle = '#fff';
            context.fillRect(0, 0, pageCanvas.width, 30);
            // Draw the current page onto the new canvas
            context.drawImage(canvas, 0, position + 30); // add 30 pixels of padding at the top
            // Add the canvas image to the PDF document
            const imgData = pageCanvas.toDataURL('image/png');
            const imgWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (pageCanvas.height * imgWidth) / pageCanvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            // Add a new page to the PDF document if there are more pages
            if (pageIndex < pageCount - 1) {
              // Add a new page to the PDF document with padding at the bottom
              pdf.addPage();
              pdf.setFillColor(255, 255, 255);
              pdf.rect(0, pdf.internal.pageSize.getHeight() - 30, pdf.internal.pageSize.getWidth(), 30, 'F'); // add 30 pixels of padding at the bottom
            }
            // Save the PDF document when all pages have been added
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
