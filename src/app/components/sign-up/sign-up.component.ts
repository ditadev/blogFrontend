import { Component, OnDestroy, OnInit } from '@angular/core';
import { Author } from 'src/app/models/author';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  
  author!: Author;
  subscription?: Subscription;
  message?: string;
  toast:boolean=false;

  constructor(
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.author = {} as Author;
  }

  register(): any {
    this.subscription = this.apiService.registerAuthor(this.author).subscribe(
      response => {this.message=response.message
        console.log(this.message);
      },
      error => {
        console.error(error);
      });
      this.toast=!this.toast;
  }

toaster(){
  this.toast = !this.toast;
}
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
