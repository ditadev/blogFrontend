import { Component, OnDestroy, OnInit } from '@angular/core';
import { Author } from 'src/app/models/author';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  animations: [
    trigger('disabled', [
      state('true', style({ opacity: 0.5, pointerEvents: 'none' })),
      state('false', style({ opacity: 1, pointerEvents: 'auto' })),
      transition('true <=> false', animate('200ms ease-in-out'))
    ])
  ]
})
export class SignUpComponent implements OnInit, OnDestroy {
  author!: Author;
  subscription?: Subscription;
  code?: number;
  authorForm!: FormGroup;
  message!: string;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.author = {} as Author;
    this.authorForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      description: ['', [Validators.required, Validators.minLength(100)]]
    });
  }

  onSubmit(): void {
    this.register();
  }

  register(): void {
    if (this.authorForm.valid) {
      this.author = { ...this.authorForm.value };
      this.spinner.show(); // show the spinner before making API call
      this.subscription = this.apiService.registerAuthor(this.author).subscribe({
        next: (response) => {
          this.code = response.code;
          if (this.code == 0) {
            this.router.navigate(["verification"]);
          }
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.show();
          this.message = "User with email/username already exists";
        },
        complete: () => {
          this.spinner.hide();
        }
      });
    }
    else {
      this.message = 'Please fill in all required fields';
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
