import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinAuthComponent } from './pages/lin-auth/lin-auth.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { VerificationComponent } from './pages/verification/verification.component';
import { SideNavComponent } from './shared/side-nav/side-nav.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    component: SideNavComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'verification', component: VerificationComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'login-with-link/:login_id', component: LinAuthComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
