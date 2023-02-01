import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { ResetPassword } from 'src/app/models/resetPassword';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements  OnDestroy {

  subscription?: Subscription;
  _resetPassword!:ResetPassword;
  message?: string;
  code?:number;
  toast:boolean=false;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}


  ngOnInit(): void {
    this._resetPassword = {} as ResetPassword;
  }

  resetPassword():void{
    this.subscription = this.apiService.resetPassword(this._resetPassword).subscribe( response => {this.message=response.message;
      console.log(this.message);
      this.code=response.code;
            console.log(this.code);
            if(this.code==0){
              this.toast=!this.toast;
              this.location.go("/login");
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
