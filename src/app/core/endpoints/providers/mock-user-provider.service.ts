import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthProviderEndpoint } from '@core/services/auth.service';
import { User } from '@core/models/user.model';
import { EndpointService } from '@shared/endpoint.service';

/*
    This is a sample auth provider
*/
@Injectable({
    providedIn: 'root'
})
export class MockUserProviderService extends EndpointService implements AuthProviderEndpoint {

    profile(): Observable<User> {
        return this.swagger.request('getUser');
    }

    login(params?: any, id?: string): Observable<string> {
        return this.swagger.request('basicAuth').pipe(map((res: any) => res.token + '-' + id));
    }
}
