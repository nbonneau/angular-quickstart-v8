import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SharedEventService {

    private subjects: { [key: string]: BehaviorSubject<any> } = {};

    emit<T>(key: string, data: T): Observable<T> {
        this.getSubject<T>(key).next(data);
        return this.on<T>(key);
    }

    on<T>(key: string): Observable<T> {
        return this.getSubject<T>(key).asObservable();
    }

    once<T>(key: string): Observable<T> {
        return this.getSubject<T>(key).asObservable()
            .pipe(take(1));
    }

    hasEvent(key: string): boolean {
        return !!this.getSubject(key);
    }

    valueOf<T>(key: string): T {
        if (!this.hasEvent(key)) {
            return undefined;
        }
        return this.getSubject<T>(key).value;
    }

    getSubject<T>(key: string): BehaviorSubject<T> {
        if (!this.hasEvent(key)) {
            this.subjects[key] = new BehaviorSubject<T>(undefined);
        }
        return this.getSubject<T>(key);
    }

    removeEvent(key: string): void {
        if (this.hasEvent(key)) {
            this.getSubject(key).complete();
        }
        delete this.subjects[key];
    }

}
