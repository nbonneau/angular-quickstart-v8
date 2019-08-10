import { Component, OnInit } from '@angular/core';
import { FacadeService } from '../../services/facade.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private facadeService: FacadeService, private router: Router) { }

  ngOnInit() {
    this.facadeService.authService.logout();
  }

  login() {
    this.facadeService.authService.login('basic').subscribe(profile => {
      this.router.navigate(['/']);
    });
  }

}
