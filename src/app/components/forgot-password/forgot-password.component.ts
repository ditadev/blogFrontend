import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements  OnDestroy {

  _email=this.route.snapshot.paramMap.get('emailAddress')!;
  subscription?: Subscription;
  message:string="";
  code?:number;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  forgotPassword():any{
    this.subscription = this.apiService.forgotPassword(this._email).subscribe( response => {this.message=response.message;
      console.log(this.message);
      this.code=response.code;
            console.log(this.code);
            if(this.code==0){
              this.router.navigate(["resetpassword"]);
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
