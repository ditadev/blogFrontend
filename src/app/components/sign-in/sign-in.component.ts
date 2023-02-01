import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { Login } from 'src/app/models/login';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, OnDestroy {

  _login!:Login;
  subscription?: Subscription;
  message?: string;
  toast:boolean=false;
  code?:number;
  jwt?:string;

  constructor(
    private apiService: ApiService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this._login = {} as Login;
  }

  login():void{
    this.subscription=this.apiService.login(this._login).subscribe(
      response => {
        this.message = response.message;
        this.code = response.code;
        this.jwt=response.data.accessToken;
        console.log(this.message);
        console.log(this.code);
        console.log(this.jwt);
        if (this.code == 0) {
          this.toast = !this.toast;
          this.location.go("/feeds");
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
