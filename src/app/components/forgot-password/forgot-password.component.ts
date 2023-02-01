import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Location } from '@angular/common';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements  OnDestroy {

  _email=this.route.snapshot.paramMap.get('emailAddress')!;
  subscription?: Subscription;
  message?: string;
  code?:number;
  toast:boolean=false;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  forgotPassword():any{
    this.subscription = this.apiService.forgotPassword(this._email).subscribe( response => {this.message=response.message;
      console.log(this.message);
      this.code=response.code;
            console.log(this.code);
            if(this.code==0){
              this.toast=!this.toast;
              this.location.go("/resetpassword");
              }
    });
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
