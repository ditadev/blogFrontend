import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './components/web/article/article.component';
import { EditArticleComponent } from './components/web/edit-article/edit-article.component';
import { FeedsComponent } from './components/web/feeds/feeds.component';
import { ForgotPasswordComponent } from './components/portal/forgot-password/forgot-password.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MyArticlesComponent } from './components/web/my-articles/my-articles.component';
import { NewArticleComponent } from './components/web/new-article/new-article.component';
import { NotFoundComponent } from './components/web/not-found/not-found.component';
import { ProfileComponent } from './components/portal/profile/profile.component';
import { ResetpasswordComponent } from './components/portal/resetpassword/resetpassword.component';
import { SignInComponent } from './components/portal/sign-in/sign-in.component';
import { SignUpComponent } from './components/portal/sign-up/sign-up.component';
import { VerificationComponent } from './components/portal/verification/verification.component';
import { ViewMyArticleComponent } from './components/web/view-my-article/view-my-article.component';

const routes: Routes = [  
  {path: '', component: LandingPageComponent, pathMatch: 'full' },
  {path: 'login', component: SignInComponent },
  {path: 'signup', component: SignUpComponent },
  {path: 'verification', component: VerificationComponent },
  {path: 'forgotpassword', component: ForgotPasswordComponent },
  {path: 'resetpassword', component: ResetpasswordComponent },
  {path: 'feeds', component: FeedsComponent },
  {path: 'article/:postId', component: ArticleComponent },
  {path: 'my-article', component: MyArticlesComponent },
  {path: 'view-my-article/:postId', component: ViewMyArticleComponent },
  {path: 'edit-article/:postId', component: EditArticleComponent },
  {path: 'new-article', component: NewArticleComponent },
  {path: 'profile', component: ProfileComponent },
  {path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
