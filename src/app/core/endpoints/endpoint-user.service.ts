import { Injectable } from '@angular/core';

import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { HttpService } from '../services/http.service';

@Injectable({
    providedIn: 'root'
})
export class EndpointUserService {

    constructor(public http: HttpService) { }

    get(): Observable<User> {
        return this.http.get('/user.json');
    }
}
