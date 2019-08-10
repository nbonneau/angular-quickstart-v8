import { Component, OnInit } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { User } from '../../models/user.model';
import { FacadeService } from '../../services/facade.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  env = environment.env;
  user: User;

  constructor(public facade: FacadeService) { }

  ngOnInit() {
    this.facade.userEndpointService.get().subscribe((user) => this.user = user);
  }

}
