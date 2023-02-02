import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedsComponent } from './components/feeds/feeds.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { VerificationComponent } from './components/verification/verification.component';

const routes: Routes = [  
  {path: '', component: LandingPageComponent, pathMatch: 'full' },
  {path: 'login', component: SignInComponent },
  {path: 'signup', component: SignUpComponent },
  {path: 'verification', component: VerificationComponent },
  {path: 'forgotpassword', component: ForgotPasswordComponent },
  {path: 'resetpassword', component: ResetpasswordComponent },
  {path: 'feeds', component: FeedsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
