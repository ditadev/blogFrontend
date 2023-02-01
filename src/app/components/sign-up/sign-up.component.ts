import { Component, OnDestroy, OnInit } from '@angular/core';
import { Author } from 'src/app/models/author';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

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
  code?:number;

  constructor(
    private apiService: ApiService,
    private location: Location,

  ) {}

  ngOnInit(): void {
    this.author = {} as Author;
  }
  
  register(): void {
    this.subscription = this.apiService.registerAuthor(this.author).subscribe(
      ({ message, code }) => {
        this.message = message;
        console.log(message);
        if (code === 0) {
          this.toast = !this.toast;
          this.location.go("/login");
        }
      }
    );
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
