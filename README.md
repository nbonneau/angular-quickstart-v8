# AngularQuickstartV8

## Project structure

```
app/
├── config              // App configuration
├── core                // Core module
│   ├── endpoints           // Endpoint services
│   │   └── providers       // Endpoint provider services
│   ├── guards
│   ├── interceptors
│   ├── models              // App models
│   └── services            // Global services
├── features            // Features folder
└── shared              // Shared module
    └── animations          // Animations folder
```

## Add endpoint

* add endpoint service into endpoints folder
```ts
import { Injectable } from '@angular/core';
import { EndpointService } from '@shared/endpoint.service';

@Injectable({
    providedIn: 'root'
})
export class CustomEndpointService extends EndpointService {
    example(): Observable<any> {

    }
}
```

* update `config/endpoints.ts` file
```ts
export interface EndpointsInterface {
    custom: CustomEndpointService;
}

export const ENDPOINTS: EndpointsInterface = {
    custom: CustomEndpointService as any
};
```

* use endpoint methods
```ts
this.facadeService.endpoints.custom.example().subscribe((data) => {
    // ...
});
```

## Add auth endpoint provider

* add provider service into providers folder
```ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointService } from '@shared/endpoint.service';
import { AuthProviderEndpoint } from '@core/services/auth.service';
import { User } from '@core/models/user.model';

@Injectable({
    providedIn: 'root'
})
export class CustomUserProviderService extends EndpointService implements AuthProviderEndpoint {

    profile(): Observable<User> {
        // ...
    }

    login(params?: any, id?: string): Observable<string> {
        // ...
    }
}
```

* update `config/providers.ts` file
```ts
export const AUTH_PROVIDERS: Array<AuthProviderConfig> = [
    // ...
    {
        name: 'custom',
        class: CustomUserProviderService as any
    }
];
```

* use login method
```ts
this.facadeService.authService.login('custom').subscribe(() => {
    // ...
});
```

## Animation 

[https://github.com/jiayihu/ng-animate](https://github.com/jiayihu/ng-animate)