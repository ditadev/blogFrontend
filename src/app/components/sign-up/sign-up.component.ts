import { Component, OnDestroy, OnInit } from '@angular/core';
import { Author } from 'src/app/models/author';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  
  author!: Author;
  subscription?: Subscription;
  message: string="";
  code?:number;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.author = {} as Author;
  }

  register(): void {
    this.spinner.show(); // show the spinner before making API call
    this.subscription = this.apiService.registerAuthor(this.author).subscribe({
      next: (response) => {
        this.message = response.message;
        console.log(this.message);
        this.code = response.code;
        console.log(this.code);
        if (this.code == 0) {
          this.router.navigate(["verification"]);
        }
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        this.message = "Error Message";
      },
      complete: () => {
        this.spinner.hide();
      }
    });
  }
  

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
