import { Component, OnInit } from '@angular/core';
import { tap, flatMap } from 'rxjs/operators';
import { forkJoin, of, Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { FacadeService } from './core/services/facade.service';
import { AuthProviderConfig } from './core/services/auth.service';

import * as moment from 'moment';

import { BasicUserProviderService } from './core/endpoints/providers/basic-user-provider.service';

export const AUTH_PROVIDERS: Array<AuthProviderConfig> = [{
  name: 'basic',
  class: BasicUserProviderService as any
}];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  loading = true;
  initialized: boolean;

  constructor(private facadeService: FacadeService) { }

  ngOnInit() {

    this.facadeService.sharedService.on('GLOBAL_LOADING', this.loading).subscribe((loading: boolean) => this.loading = loading);

    this.initialize().subscribe(() => {
      if (!environment.production) {
        this.printEnvInfos();
      }
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
        this.facadeService.sharedService.emit('GLOBAL_LOADING', false);
      }),
      flatMap(() => of(undefined))
    );
  }

  private printEnvInfos(): void {
    const operations = this.facadeService.swaggerService.operations;
    console.log('[app] online state: %s', this.facadeService.offlineService.state);
    console.log('[app] browser locale: %s', document.documentElement.lang);
    console.log('[app] %s environment', environment.id, environment);
    console.log('[app] swagger loaded from %s', this.facadeService.swaggerService.fullpath);
    console.log('[app] mapped %s operation endpoint(s)', Object.keys(operations).length, operations);
    console.log('[app] shared events', this.facadeService.sharedService.subjects);
  }

}
