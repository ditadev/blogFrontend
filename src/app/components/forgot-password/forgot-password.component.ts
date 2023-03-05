import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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
export class ForgotPasswordComponent implements OnDestroy, OnInit {

  _email!: string;
  subscription?: Subscription;
  message: string = "";
  code?: number;
  forgotPasswordForm!: FormGroup;


  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this._email = this.route.snapshot.paramMap.get('emailAddress')!;
    this.forgotPasswordForm = this.formBuilder.group({
      emailAddress: ['', [Validators.required, Validators.email]],
    });

  }

  forgotPassword(): void {
    if (this.forgotPasswordForm.valid) {
      this._email = this.forgotPasswordForm.value.emailAddress;
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
        this.message = 'If email is registered, you will receive a token';
        this.spinner.show();
      },
    });
    }else {
      this.message = 'Please fill in all required fields';
    }
  }

  onSubmit(): void {
    this.forgotPassword();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
