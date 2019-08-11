import { Injectable, Injector } from '@angular/core';
import { HttpService } from '@core/services/http.service';
import { OfflineService } from '@core/services/offline.service';
import { SharedEventService } from '@core/services/shared.service';
import { AuthService } from '@core/services/auth.service';
import { SwaggerService } from '@core/services/swagger.service';

@Injectable({
  providedIn: 'root'
})
export class FacadeService {

  // tslint:disable-next-line: variable-name
  private __httpService: HttpService;
  get httpService(): HttpService {
    if (!this.__httpService) {
      this.__httpService = this.injector.get(HttpService);
    }
    return this.__httpService;
  }

  // tslint:disable-next-line: variable-name
  private __swaggerService: SwaggerService;
  get swaggerService(): SwaggerService {
    if (!this.__swaggerService) {
      this.__swaggerService = this.injector.get(SwaggerService);
    }
    return this.__swaggerService;
  }

  // tslint:disable-next-line: variable-name
  private __authService: AuthService;
  get authService(): AuthService {
    if (!this.__authService) {
      this.__authService = this.injector.get(AuthService);
    }
    return this.__authService;
  }

  // tslint:disable-next-line: variable-name
  private __offlineService: OfflineService;
  get offlineService(): OfflineService {
    if (!this.__offlineService) {
      this.__offlineService = this.injector.get(OfflineService);
    }
    return this.__offlineService;
  }

  // tslint:disable-next-line: variable-name
  private __sharedService: SharedEventService;
  get sharedService(): SharedEventService {
    if (!this.__sharedService) {
      this.__sharedService = this.injector.get(SharedEventService);
    }
    return this.__sharedService;
  }

  constructor(private injector: Injector) { }

}
