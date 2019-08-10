import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';


const routes: Routes = [{
  path: '',
  loadChildren: () => import('./core/features/home/home.module').then(mod => mod.HomeModule)
}, {
  path: 'login',
  loadChildren: () => import('./core/features/login/login.module').then(mod => mod.LoginModule)
}, {
  path: '**',
  redirectTo: '',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: environment.enableNavigationTracing
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
