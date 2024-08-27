import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./guard/auth.guard";
import { SecureInnerPagesGuard } from "./guard/secure-inner-pages.guard.ts.guard";

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'panel',
  //   pathMatch: 'full'
  // },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'panel',
    loadChildren: () => import('./panel/panel.module').then( m => m.PanelPageModule )
  },
  {
    path: 'config',
    canActivate: [AuthGuard],
    loadChildren: () => import('./config/config.module').then( m => m.ConfigPageModule)
  },
  {
    path: 'privacy-politics',
    loadChildren: () => import('./privacy-politics/privacy-politics.module').then( m => m.PrivacyPoliticsPageModule)
  },
  {
    path: 'questions',
    loadChildren: () => import('./questions/questions.module').then( m => m.QuestionsPageModule)
  },
  {
    path: 'my-packages',
    canActivate: [AuthGuard],
    loadChildren: () => import('./my-packages/my-packages.module').then( m => m.MyPackagesPageModule)
  },
  {
    path: 'register',
    canActivate: [SecureInnerPagesGuard],
    loadChildren: () => import('./auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'login',
    canActivate: [SecureInnerPagesGuard],
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'package-detail',
    loadChildren: () => import('./package-detail/package-detail.module').then( m => m.PackageDetailPageModule)
  },
  {
    path: 'package-qr-detail',
    canActivate: [AuthGuard],
    loadChildren: () => import('./package-qr-detail/package-qr-detail.module').then( m => m.PackageQrDetailPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'scan',
    canActivate: [AuthGuard],
    loadChildren: () => import('./scan/scan.module').then( m => m.ScanPageModule)
  },
  {
    path: 'stripe-card',
    canActivate: [AuthGuard],
    loadChildren: () => import('./stripe-card/stripe-card.module').then( m => m.StripeCardPageModule)
  },
  {
    path: 'sponsor',
    canActivate: [AuthGuard],
    loadChildren: () => import('./sponsor/sponsor.module').then( m => m.SponsorPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./auth/welcome/welcome.module').then( m => m.WelcomePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
