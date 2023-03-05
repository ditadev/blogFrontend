import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ResetPassword } from 'src/app/models/resetPassword';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
  animations: [
    trigger('disabled', [
      state('true', style({ opacity: 0.5, pointerEvents: 'none' })),
      state('false', style({ opacity: 1, pointerEvents: 'auto' })),
      transition('true <=> false', animate('200ms ease-in-out'))
    ])
  ]
})
export class ResetpasswordComponent implements OnDestroy {

  subscription?: Subscription;
  _resetPassword!: ResetPassword;
  message: string = "";
  code?: number;
  resetPasswordForm!: FormGroup;


  constructor(
    private apiService: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit(): void {
    this._resetPassword = {
      emailAddress: "",
      token: "",
      password: "",
      confirmPassword: ""
    };

    this.resetPasswordForm = this.formBuilder.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      token: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), this.matchPasswords.bind(this)]],
    });
  }

  matchPasswords(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  resetPassword(): void {
    if (this.resetPasswordForm.valid) {
      this._resetPassword = { ...this.resetPasswordForm.value };
      this.spinner.show(); // show the spinner before making API call
      this.apiService.resetPassword(this._resetPassword).subscribe({
        next: (response) => {
          this.message = response.message;
          this.code = response.code;
          if (this.code == 0) {
            this.router.navigate(["login"]);
          }
          this.spinner.hide(); // hide the spinner when API call is successful
        },
        error: (error) => {
          this.message = "Invalid email/token";
          this.spinner.hide(); // hide the spinner when API call is successful
        }
      });
    } else {
      this.message = 'Please fill in all required fields';
    }
  }

  onSubmit(): void {
    this.resetPassword();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
