import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_CONFIG } from './services/http.service';

import { environment } from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [

  ],
  providers: [
    {
      provide: HTTP_CONFIG,
      useValue: environment.api
    }
  ]
})
export class CoreModule { }
