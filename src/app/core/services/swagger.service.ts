import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';
import { of, Observable, Subject } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SwaggerService {

    initialized: boolean;
    operations: { [key: string]: { url: string; path: string; method: string; definition: any } } = {};

    private swagger: any;
    private swaggerLoad: Subject<any> = new Subject();

    get definition(): any { return this.swagger; }
    get fullpath(): string { return this.http.getFullpath(environment.api.swaggerPath); }
    get loaded(): Observable<any> { return this.swaggerLoad.asObservable(); }

    constructor(private http: HttpService) { }

    initialize(): Observable<any> {
        if (this.initialized) {
            return of(this.definition);
        }
        return this.loadSwagger();
    }

    request(operationId: string, params?: any, opts?: any): Observable<any> {
        return this.loadSwagger().pipe(
            flatMap(() => {
                const operation = this.operations[operationId];
                if (!operation) {
                    throw new Error('Invalid operation id: ' + operationId);
                }
                return this.http.request(operation.method, operation.path, params, opts);
            })
        );
    }

    private formatOperations(): any {
        Object.keys(this.definition.paths).forEach((path: string) => {
            Object.keys(this.definition.paths[path]).forEach((method: string) => {
                this.operations[this.definition.paths[path][method].operationId] = {
                    url: this.http.getFullpath(path),
                    path,
                    method,
                    definition: this.definition.paths[path][method]
                };
            });
        });
    }

    private loadSwagger(): Observable<any> {
        if (!this.definition) {
            return this.http.get(environment.api.swaggerPath).pipe(tap((swagger) => {
                if (!this.definition) {
                    this.swagger = swagger;
                    this.formatOperations();
                    this.swaggerLoad.next(swagger);
                }
            }));
        }
        return of(this.definition);
    }
}
