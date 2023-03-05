import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
export class VerificationComponent implements OnDestroy, OnInit {

  _email!: string;
  _token!: string;
  subscription?: Subscription;
  message: string = "";
  code?: number;
  verifyAccountForm!: FormGroup;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this._token = this.route.snapshot.paramMap.get('token')!;
    this._email = this.route.snapshot.paramMap.get('emailAddress')!
    this.verifyAccountForm = this.formBuilder.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      token: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  verifyUser(): void {
    if (this.verifyAccountForm.valid) {
      this._email = this.verifyAccountForm.value.emailAddress;
      this._token = this.verifyAccountForm.value.token;
      this.spinner.show(); // show the spinner before making API call
      this.subscription = this.apiService.verifyAuthor(this._email, this._token).subscribe({
        next: (response) => {
          this.code = response.code;
          if (this.code == 0) {
            this.router.navigate(["login"]);
          }
        },
        error: (error) => {
          this.spinner.hide(); // hide the spinner when API call is successful
          this.message = "Kindly enter a registered email and a valid token";
        },
        complete: () => {
          this.spinner.hide(); // hide the spinner when API call is successful
        },
      });
    } else {
      this.message = 'Please fill in all required fields';
    }
  }

  onSubmit(): void {
    this.verifyUser();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
