import { Injectable, Inject, InjectionToken } from '@angular/core';
import { Observable, Subject, of, throwError, TimeoutError } from 'rxjs';
import { tap, catchError, retryWhen, concatMap, delay, timeout } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import * as extend from 'extend';

import { HTTP_DEFAULT_CONFIG } from '@app/app.constants';
import { environment } from '@env/environment';

export interface SharedRequest {
    pending: boolean;
    responseSubject: Subject<any>;
    requestObservable: Observable<any>;
    responseObservable: Observable<any>;
}

export interface HttpApiConfig {
    host?: string;
    version?: string;
    shared?: boolean;
    retry?: {
        attemps?: number;
        delay?: number;
        statuses?: Array<number>;
    };
    timeout?: number;
}

export const HTTP_CONFIG: InjectionToken<HttpApiConfig> = new InjectionToken<HttpApiConfig>('HttpApiConfig', {
    providedIn: 'root',
    factory: () => environment.api
});

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    static METHOD_GET = 'GET';
    static METHOD_PUT = 'PUT';
    static METHOD_POST = 'POST';
    static METHOD_PATCH = 'PATCH';
    static METHOD_DELETE = 'DELETE';

    protected pendingRequest: { [url: string]: { [method: string]: { [params: string]: SharedRequest } } } = {};
    protected errorSubject: Subject<HttpErrorResponse> = new Subject();
    protected errorStatusSubject: Subject<HttpErrorResponse> = new Subject();

    get host(): string {
        return this.config.host || 'http://localhost:4200/assets/mocks';
    }

    constructor(@Inject(HTTP_CONFIG) public config: HttpApiConfig, protected http: HttpClient) {
        this.config = extend(true, HTTP_DEFAULT_CONFIG, config || {});
    }

    get(url: string, params?: any, opts?: HttpApiConfig): Observable<any> {
        return this.request(HttpService.METHOD_GET, url, params, opts);
    }

    put(url: string, params?: any, opts?: HttpApiConfig): Observable<any> {
        return this.request(HttpService.METHOD_PUT, url, params, opts);
    }

    post(url: string, params?: any, opts?: HttpApiConfig): Observable<any> {
        return this.request(HttpService.METHOD_POST, url, params, opts);
    }

    patch(url: string, params?: any, opts?: HttpApiConfig): Observable<any> {
        return this.request(HttpService.METHOD_PATCH, url, params, opts);
    }

    delete(url: string, params?: any, opts?: HttpApiConfig): Observable<any> {
        return this.request(HttpService.METHOD_DELETE, url, params, opts);
    }

    getFullpath(path: string, host?: string): string {
        return (host || this.host) + '/' + this.config.version + path;
    }

    handleError(error: HttpErrorResponse): void {
        this.errorSubject.next(error);
    }

    catchError(): Observable<HttpErrorResponse> {
        return this.errorSubject.asObservable();
    }

    catchErrorStatus(): Observable<HttpErrorResponse> {
        return this.errorStatusSubject.asObservable();
    }

    request(method: string, url: string, params?: any, opts?: HttpApiConfig): Observable<any> {

        opts = extend(true, this.config, opts);

        let req = this._getRequestObservable(method, url, params, opts.host, opts.timeout);

        if (opts.shared) {
            req = this._sharedRequest(this._addsharedRequest(method, url, params, opts));
        } else if (opts.retry) {
            req = this._retryRequest(this._getRequestObservable(method, url, params, opts.host, opts.timeout), opts);
        }

        return req.pipe(tap(() => {
            if (opts.shared) {
                delete this.pendingRequest[url][method];
            }
        }));
    }

    protected _addsharedRequest(method: string, url: string, params?: any, opts?: HttpApiConfig): SharedRequest {

        opts = extend(true, this.config, opts);

        this.pendingRequest[url] = this.pendingRequest[url] ? this.pendingRequest[url] : {};
        this.pendingRequest[url][method] = this.pendingRequest[url][method] ? this.pendingRequest[url][method] : {};

        const config = this.pendingRequest[url][method][JSON.stringify(params || {})]
            || this._createSharedRequest(method, url, params, opts);

        this.pendingRequest[url][method][JSON.stringify(params || {})] = config;

        return config;
    }

    protected _createSharedRequest(method: string, url: string, params?: any, opts?: HttpApiConfig): SharedRequest {

        opts = extend(true, this.config, opts);

        const responseSubject = new Subject();

        let requestObservable = this._getRequestObservable(method, url, params, opts.host, opts.timeout);

        if (opts.retry) {
            requestObservable = this._retryRequest(this._getRequestObservable(method, url, params, opts.host, opts.timeout), opts);
        }

        const config = {
            requestObservable,
            responseSubject,
            responseObservable: responseSubject.asObservable(),
            pending: false
        };

        return config;
    }

    protected _sharedRequest(config: SharedRequest): Observable<any> {
        if (config.pending) {
            return new Observable(observer => {
                config.responseObservable.subscribe((result) => {
                    if (result instanceof HttpErrorResponse) {
                        observer.error(result);
                    } else {
                        observer.next(result);
                    }
                    observer.complete();
                });
            });
        }

        config.pending = true;

        return config.requestObservable.pipe(tap(res => {
            config.pending = false;
            config.responseSubject.next(res);
        }), catchError(err => {
            config.pending = false;
            config.responseSubject.next(err);
            return throwError(err);
        }));
    }

    protected _retryRequest(obs: Observable<any>, opts?: HttpApiConfig): Observable<any> {

        opts = extend(true, this.config, opts);

        return obs.pipe(retryWhen(errors => errors
            .pipe(concatMap((error, count) => {

                const match = opts.retry.statuses.indexOf(error.status) !== -1 || error instanceof TimeoutError;

                if (count < opts.retry.attemps && match) {
                    return of(error);
                }
                if (match) {
                    this.errorStatusSubject.next(error);
                }

                return throwError(error);
            }), delay(opts.retry.delay || 0))
        ));
    }

    protected _getRequestObservable(method: string, path: string, params?: any, host?: string, timeo?: number): Observable<any> {
        return this.http[method.toLowerCase()](this.getFullpath(path, host), params).pipe(timeout(timeo));
    }

}
