import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalInterceptor } from '@core/interceptors/global.interceptor';
import { ErrorInterceptor } from '@core/interceptors/error.interceptor';
import { AuthInterceptor } from '@core/interceptors/auth.interceptor';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
  ]
})
export class CoreModule { }
