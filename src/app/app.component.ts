import { Component, OnInit } from '@angular/core';
import { tap, flatMap } from 'rxjs/operators';
import { forkJoin, of, Observable } from 'rxjs';
import { Platform } from '@angular/cdk/platform';

import * as moment from 'moment';

import { environment } from '@env/environment';
import { FacadeService } from '@core/services/facade.service';
import { AUTH_PROVIDERS } from '@app/auth.providers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  loading = true;
  initialized: boolean;

  constructor(private facadeService: FacadeService, public platform: Platform) { }

  ngOnInit() {

    this.facadeService.sharedService.on('GLOBAL_LOADING', this.loading).subscribe((loading: boolean) => this.loading = loading);

    if (!environment.production) {
      console.log('[app] initialize application');
      // tslint:disable-next-line: no-console
      console.time('[app] initialized in');
    }
    this.initialize().subscribe(() => {
      if (!environment.production) {
        // tslint:disable-next-line: no-console
        console.timeEnd('[app] initialized in');
        this.printEnvInfos();
        this.facadeService.authService.profileChange().subscribe((profile) => console.log('[app] new user profile:', profile));
      }
      this.facadeService.sharedService.emit('GLOBAL_LOADING', false);
    });
  }

  private initialize(): Observable<void> {

    if (this.initialized) {
      return of(undefined);
    }

    moment.locale(document.documentElement.lang);

    return forkJoin([
      this.facadeService.offlineService.initialize(),
      this.facadeService.swaggerService.initialize(),
      this.facadeService.authService.initialize({ providers: AUTH_PROVIDERS })
    ]).pipe(
      tap(() => {
        this.initialized = true;
      }),
      flatMap(() => of(undefined))
    );
  }

  private printEnvInfos(): void {
    const operations = this.facadeService.swaggerService.operations;
    console.log('[app] browser infos: network::%s | locale::%s | platform::%s ' + (this.platform.isBrowser ? '(browser)' : ''),
      this.facadeService.offlineService.state,
      document.documentElement.lang,
      this.getPlatform()
    );
    console.log('[app] %s environment', environment.id, environment);
    console.log('[app] swagger loaded from %s', this.facadeService.swaggerService.fullpath);
    console.log('[app] %s operation endpoint(s) mapped', Object.keys(operations).length, operations);
  }

  private getPlatform() {
    return Object.keys(this.platform).filter(key => ['isBrowser', '_platformId'].indexOf(key) === -1).reduce((acc, key) => {
      if (this.platform[key]) {
        acc = key;
      }
      return acc;
    }, null);
  }
}
