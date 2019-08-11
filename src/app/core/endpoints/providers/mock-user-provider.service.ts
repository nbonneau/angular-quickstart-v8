import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SwaggerService } from '@core/services/swagger.service';
import { AuthProviderEndpoint } from '@core/services/auth.service';
import { User } from '@core/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class MockUserProviderService implements AuthProviderEndpoint {

    constructor(public swagger: SwaggerService) { }

    profile(): Observable<User> {
        return this.swagger.request('getUser');
    }

    login(params?: any, id?: string): Observable<string> {
        return this.swagger.request('basicAuth').pipe(map((res: any) => res.token + '-' + id));
    }
}
