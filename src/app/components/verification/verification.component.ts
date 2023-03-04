import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
  animations: [
    trigger('disabled', [
      state('true', style({ opacity: 0.5, pointerEvents: 'none' })),
      state('false', style({ opacity: 1, pointerEvents: 'auto' })),
      transition('true <=> false', animate('200ms ease-in-out'))
    ])
  ]
})
export class VerificationComponent implements  OnDestroy {

_email=this.route.snapshot.paramMap.get('emailAddress')!;
_token=this.route.snapshot.paramMap.get('token')!;
  subscription?: Subscription;
  message:string="";
  code?:number;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  verifyUser(): void {
    this.spinner.show(); // show the spinner before making API call
    this.subscription = this.apiService.verifyAuthor(this._email, this._token).subscribe({
      next: (response) => {
        this.code = response.code;
        console.log(this.code);
        if (this.code == 0) {
          this.router.navigate(["login"]);
        }
      },
      error: (error) => {
        this.spinner.hide(); // hide the spinner when API call is successful
        this.message = "Error Message";
      },
      complete: () => {
        this.spinner.hide(); // hide the spinner when API call is successful
      },
    });
  }
  

    ngOnDestroy(): void {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
}
