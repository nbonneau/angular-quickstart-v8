import { Injectable, Injector } from '@angular/core';
import { HttpService } from './http.service';
import { OfflineService } from './offline.service';
import { SharedEventService } from './shared.service';
import { EndpointUserService } from '../endpoints/endpoint-user.service';

@Injectable({
  providedIn: 'root'
})
export class FacadeService {

  // tslint:disable-next-line: variable-name
  private __userEndpointService: EndpointUserService;
  get userEndpointService(): EndpointUserService {
    if (!this.__userEndpointService) {
      this.__userEndpointService = this.injector.get(EndpointUserService);
    }
    return this.__userEndpointService;
  }

  // tslint:disable-next-line: variable-name
  private __httpService: HttpService;
  get httpService(): HttpService {
    if (!this.__httpService) {
      this.__httpService = this.injector.get(HttpService);
    }
    return this.__httpService;
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
