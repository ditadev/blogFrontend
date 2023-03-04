import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


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
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  forgotPassword(): void {
    this.spinner.show();
    this.subscription = this.apiService.forgotPassword(this._email).subscribe({
      next: (response) => {
        this.message = response.message;
        console.log(this.message);
        this.code = response.code;
        console.log(this.code);
        if (this.code == 0) {
          this.router.navigate(['resetpassword']);
        }
        this.spinner.hide();
      },
      error: (error) => {
        this.message = 'Error Message';
        this.spinner.hide();
      },
    });
  }
  


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
