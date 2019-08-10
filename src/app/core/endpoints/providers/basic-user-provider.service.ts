import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { User } from '../../models/user.model';
import { SwaggerService } from '../../services/swagger.service';
import { AuthProviderEndpoint } from '../../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class BasicUserProviderService implements AuthProviderEndpoint {

    constructor(public swagger: SwaggerService) { }

    profile(): Observable<User> {
        return this.swagger.request('getUser');
    }

    login(params?: any, id?: string): Observable<string> {
        return of('token-' + id);
    }
}
