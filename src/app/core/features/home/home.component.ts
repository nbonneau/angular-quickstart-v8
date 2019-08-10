import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FacadeService } from '../../services/facade.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  date = moment();
  user: User;

  constructor(public facadeservice: FacadeService) { }

  ngOnInit() {
    this.facadeservice.authService.getProfile().subscribe(profile => this.user = profile);
  }

  logout() {
    this.facadeservice.authService.logout(true);
  }

}
