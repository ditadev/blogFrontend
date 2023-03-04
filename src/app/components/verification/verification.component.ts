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
  message:string="";
  code?:number;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  verifyUser():any{
    this.subscription = this.apiService.verifyAuthor(this._email,this._token).subscribe( response => {
      this.code=response.code;
            console.log(this.code);
            if(this.code==0){
              this.router.navigate(["login"]);
            }
    },
    error => {
      this.message="Error Message"
     }
    );

    }

    ngOnDestroy(): void {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
}
