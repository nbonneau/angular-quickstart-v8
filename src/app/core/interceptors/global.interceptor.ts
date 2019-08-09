import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {

    static DEFAULT_CONTENT_TYPE = 'application/json';
    static DEFAULT_ACCEPT = 'application/json';

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', GlobalInterceptor.DEFAULT_CONTENT_TYPE) });
        }

        if (!request.headers.has('Accept')) {
            request = request.clone({ headers: request.headers.set('Accept', GlobalInterceptor.DEFAULT_ACCEPT) });
        }
        return next.handle(request);
    }
}
