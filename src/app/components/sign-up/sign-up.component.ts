import { Component, OnDestroy, OnInit } from '@angular/core';
import { Author } from 'src/app/models/author';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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
    private router: Router

  ) {}

  ngOnInit(): void {
    this.author = {} as Author;
  }

  register(): void {
    this.subscription = this.apiService.registerAuthor(this.author).subscribe(
      response => {this.message=response.message;
        console.log(this.message);
        this.code=response.code;
        console.log(this.code);
        if(this.code==0){
          this.router.navigate(["verification"]);
          }
      },
      error => {
        this.message="Error Message"
       }
     );
  }



  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
