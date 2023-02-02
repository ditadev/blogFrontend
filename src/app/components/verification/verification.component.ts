import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Router } from '@angular/router';
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
  code?:number;
  toast:boolean=false;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  verifyUser():any{
    this.subscription = this.apiService.verifyAuthor(this._email,this._token).subscribe( response => {this.message=response.message;
      console.log(this.message);
      this.code=response.code;
            console.log(this.code);
            if(this.code==0){
              this.toast=!this.toast;
              this.router.navigate(["login"]);
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
