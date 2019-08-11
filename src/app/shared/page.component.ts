
import { Router, ActivatedRoute } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import * as moment from 'moment';

import { FacadeService } from '@core/services/facade.service';
import { User } from '@core/models/user.model';

export class PageComponent implements OnInit, OnDestroy {

    profile: User;

    private profileSubscription: Subscription;

    get moment() { return moment(); }

    constructor(
      protected facadeService: FacadeService,
      protected router: Router,
      protected route: ActivatedRoute
    ) { }

    ngOnInit() {
      this.profileSubscription = this.facadeService.authService.getProfile()
        .subscribe(profile => this.profile = profile);
    }

    ngOnDestroy() {
      if (this.profileSubscription) {
        this.profileSubscription.unsubscribe();
      }
    }

    logout(redirect: boolean = true) {
      this.facadeService.authService.logout(redirect);
    }
}
