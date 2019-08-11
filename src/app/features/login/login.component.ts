import { Component, OnInit } from '@angular/core';
import { PageComponent } from '@shared/page.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends PageComponent implements OnInit {

  login() {
    this.facadeService.authService
      .login('mock')
      .subscribe(() => this.router.navigate(['/']));
  }

}
