import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class SharedEventService {

    subjects: { [key: string]: BehaviorSubject<any> } = {};

    emit<T>(key: string, data: T): Observable<T> {
        if (!environment.production) {
            console.log('[app] emit event %s =>', key, data);
        }
        this.subjectOf<T>(key).next(data);
        return this.on<T>(key);
    }

    on<T>(key: string, data?: any): Observable<T> {
        return this.subjectOf<T>(key, data).asObservable();
    }

    once<T>(key: string, data?: any): Observable<T> {
        return this.subjectOf<T>(key, data).asObservable()
            .pipe(take(1));
    }

    hasEvent(key: string): boolean {
        return !!this.subjects[key];
    }

    valueOf<T>(key: string, value?: any): T {
        if (!this.hasEvent(key)) {
            return undefined;
        }
        return this.subjectOf<T>(key, value).value;
    }

    subjectOf<T>(key: string, value?: any): BehaviorSubject<T> {
        if (!this.hasEvent(key)) {
            this.subjects[key] = new BehaviorSubject<T>(value);
        }
        return this.subjects[key];
    }

    removeEvent(key: string): void {
        if (this.hasEvent(key)) {
            this.subjectOf(key).complete();
        }
        delete this.subjects[key];
    }

}
