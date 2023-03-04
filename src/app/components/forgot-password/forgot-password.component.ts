import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  animations: [
    trigger('disabled', [
      state('true', style({ opacity: 0.5, pointerEvents: 'none' })),
      state('false', style({ opacity: 1, pointerEvents: 'auto' })),
      transition('true <=> false', animate('200ms ease-in-out'))
    ])
  ]
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
        this.code = response.code;
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
