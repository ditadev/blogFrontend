import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements  OnDestroy {

_email=this.route.snapshot.paramMap.get('emailAddress')!;
_token=this.route.snapshot.paramMap.get('token')!;
  subscription?: Subscription;
  message?: string;
  toast:boolean=false;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  verifyUser():any{
    this.subscription = this.apiService.verifyAuthor(this._email,this._token).subscribe( response => {this.message=response.message
      console.log(this.message);
    });
    this.toast=!this.toast;
    this.location.go("");
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
