import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OfflineService {

    private offlineSubject: BehaviorSubject<boolean> = new BehaviorSubject(!window.navigator.onLine);
    private onlineSubject: BehaviorSubject<boolean> = new BehaviorSubject(window.navigator.onLine);
    private stateSubject: BehaviorSubject<string> = new BehaviorSubject(window.navigator.onLine ? 'online' : 'offline');

    state: string = window.navigator.onLine ? 'online' : 'offline';

    get offline(): Observable<boolean> {
        return this.offlineSubject.asObservable();
    }

    get online(): Observable<boolean> {
        return this.onlineSubject.asObservable();
    }

    get stateChange(): Observable<string> {
        return this.stateSubject.asObservable();
    }

    get isOffline() {
        return this.state === 'offline';
    }

    get isOnline() {
        return this.state === 'online';
    }

    constructor() {
        window.addEventListener('offline', () => {
            this.offlineSubject.next(true);
            this.onlineSubject.next(false);
            this.stateSubject.next('offline');
            this.state = 'offline';
        });
        window.addEventListener('online', () => {
            this.onlineSubject.next(true);
            this.offlineSubject.next(false);
            this.stateSubject.next('online');
            this.state = 'online';
        });
    }

    initialize() {
        return new Observable(obs => {
            this.state = window.navigator.onLine ? 'online' : 'offline';
            obs.next();
            obs.complete();
        });
    }
}
