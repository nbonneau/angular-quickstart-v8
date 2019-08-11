import { Component, OnInit } from '@angular/core';
import { FeatureComponent } from '@shared/feature.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends FeatureComponent implements OnInit {

  login() {
    this.facadeService.authService
      .login('mock')
      .subscribe(() => this.router.navigate(['/']));
  }

}
