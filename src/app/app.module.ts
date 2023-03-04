import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { JwtModule } from "@auth0/angular-jwt";
import { AuthGuard } from './guard/auth-guard.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { VerificationComponent } from './components/verification/verification.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { FeedsComponent } from './components/feeds/feeds.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ArticleComponent } from './components/article/article.component';
import { MyArticlesComponent } from './components/my-articles/my-articles.component';
import { ViewMyArticleComponent } from './components/view-my-article/view-my-article.component';
import { EditArticleComponent } from './components/edit-article/edit-article.component';
import { NewArticleComponent } from './components/new-article/new-article.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProfileComponent } from './components/profile/profile.component';

export function tokenGetter() {
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    SignInComponent,
    SignUpComponent,
    VerificationComponent,
    ForgotPasswordComponent,
    FeedsComponent,
    ResetpasswordComponent,
    NotFoundComponent,
    NavBarComponent,
    ArticleComponent,
    MyArticlesComponent,
    ViewMyArticleComponent,
    EditArticleComponent,
    NewArticleComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5259"],
        disallowedRoutes: []
      }
  }),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
