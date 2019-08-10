import { Observable, of, Subject, throwError } from 'rxjs';
import { map, catchError, flatMap, tap } from 'rxjs/operators';
import { Injectable, InjectionToken, Inject, Injector } from '@angular/core';
import { HttpRequest } from '@angular/common/http';

import * as extend from 'extend';

import { User } from '../models/user.model';
import { AUTH_DEFAULT_CONFIG } from 'src/app/app.constants';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export const AUTH_CONFIG: InjectionToken<AuthConfig> = new InjectionToken<AuthConfig>('AuthConfig', {
  providedIn: 'root',
  factory: () => (environment as any).auth || {}
});

export interface AuthProviderEndpoint {
  profile(): Observable<User>;
  login(params?: any, id?: string): Observable<string>;
}

export interface AuthConfig {
  authRedirectUrl?: string;
  unauthRedirectUrl?: string;
  authKey?: string;
  tokenKey?: string;
  tokenType?: string;
  providers: Array<AuthProviderConfig>;
}

export interface AuthProviderConfig {
  name: string;
  class: InjectionToken<any>;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  providers: Array<{ name: string; service: AuthProviderEndpoint }> = [];

  // tslint:disable-next-line: variable-name
  private _profile: User;
  // tslint:disable-next-line: variable-name
  private _profileSubject: Subject<User | undefined> = new Subject();
  // tslint:disable-next-line: variable-name
  private _loggedInSubject: Subject<User> = new Subject();
  // tslint:disable-next-line: variable-name
  private _loggedOutSubject: Subject<void> = new Subject();

  get provider(): string {
    return localStorage.getItem(this.config.authKey);
  }

  set provider(provider: string) {
    if (!provider) {
      localStorage.removeItem(this.config.authKey);
    } else {
      localStorage.setItem(this.config.authKey, provider);
    }
  }

  get token(): string {
    return localStorage.getItem(this.config.tokenKey);
  }

  set token(authToken: string) {
    if (!authToken) {
      localStorage.removeItem(this.config.tokenKey);
    } else {
      localStorage.setItem(this.config.tokenKey, authToken);
    }
  }

  constructor(@Inject(AUTH_CONFIG) public config: AuthConfig, private injector: Injector, private router: Router) {
    this.config = extend(true, AUTH_DEFAULT_CONFIG, config);
  }

  initialize(config?: AuthConfig): Observable<void> {
    return new Observable(obs => {
      this.config = extend(true, AUTH_DEFAULT_CONFIG, config || {});
      this.providers = this.config.providers.map(provider => ({
        name: provider.name,
        service: this.injector.get<any>(provider.class)
      }));
      obs.next();
      obs.complete();
    });
  }

  login(provider: string, params?: any): Observable<User> {
    const providerService = this.findProvider(provider);
    if (!providerService) {
      return throwError(new Error('No provider found for: ' + provider));
    }
    return providerService.login(params, this.makeId()).pipe(
      flatMap((token: string) => {
        this.token = token;
        return this.getProfile(provider, true);
      }),
      tap((profile: User) => {
        this.provider = provider;
        this._loggedInSubject.next(profile);
      }),
      catchError(err => {
        this.token = null;
        this.provider = null;
        this._profile = null;
        return throwError(err);
      })
    );
  }

  logout(redirect?: boolean): void {
    this.token = null;
    this.provider = null;
    this._profile = null;
    this._profileSubject.next();
    this._loggedOutSubject.next();
    if (redirect) {
      this.router.navigate([this.config.unauthRedirectUrl]);
    }
  }

  getProfile(provider: string = this.provider, force?: boolean): Observable<User | null> {
    if (!this.isAuthenticated()) {
      return of(null);
    }
    if (!force && this._profile) {
      return of(this._profile);
    }
    const providerService = this.findProvider(provider);
    if (!providerService) {
      return throwError(new Error('No provider found for: ' + provider));
    }
    return providerService.profile().pipe(map((profile: User) => {

      this._profile = profile;
      this._profileSubject.next(profile);

      return profile;
    }));
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.provider;
  }

  isAuthorized(provider: string = this.provider): Observable<boolean> {
    return this.getProfile(provider, true).pipe(map(res => !!res)).pipe(catchError(() => of(false)));
  }

  addAuthorizationHeader(request: HttpRequest<any>): HttpRequest<any> {
    if (this.token) {
      return request.clone({
        setHeaders: {
          Authorization: `${this.config.tokenType} ${this.token}`
        }
      });
    }
    return request;
  }

  profileChange(): Observable<User | undefined> {
    return this._profileSubject.asObservable();
  }

  loggedIn(): Observable<User> {
    return this._loggedInSubject.asObservable();
  }

  loggedOut(): Observable<any> {
    return this._loggedOutSubject.asObservable();
  }

  findProvider(provider: string): AuthProviderEndpoint | undefined {
    return (this.providers.find(p => p.name === provider) || { service: undefined }).service;
  }

  private makeId(length = 32) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

}
