import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import { RouterModule, Routes } from '@angular/router';
import { JwtModule } from "@auth0/angular-jwt";
import { AuthGuard } from './services/guard/auth-guard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './components/portal/landing-page/landing-page.component';
import { SignInComponent } from './components/portal/sign-in/sign-in.component';
import { SignUpComponent } from './components/portal/sign-up/sign-up.component';
import { VerificationComponent } from './components/portal/verification/verification.component';
import { ForgotPasswordComponent } from './components/portal/forgot-password/forgot-password.component';
import { FeedsComponent } from './components/web/feeds/feeds.component';
import { ResetpasswordComponent } from './components/portal/resetpassword/resetpassword.component';
import { NotFoundComponent } from './components/web/not-found/not-found.component';
import { NavBarComponent } from './components/shared/nav-bar/nav-bar.component';
import { ArticleComponent } from './components/web/article/article.component';
import { MyArticlesComponent } from './components/web/my-articles/my-articles.component';
import { ViewMyArticleComponent } from './components/web/view-my-article/view-my-article.component';
import { EditArticleComponent } from './components/web/edit-article/edit-article.component';
import { NewArticleComponent } from './components/web/new-article/new-article.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProfileComponent } from './components/portal/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/shared/footer/footer.component';

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
    ProfileComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
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
