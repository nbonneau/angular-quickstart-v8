import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgPipesModule } from 'ngx-pipes';

import {
  MatDialogModule,
  MatSnackBarModule,
  MatStepperModule,
  MatToolbarModule,
  MatIconModule,
  MatTabsModule,
  MatCardModule,
  MatButtonModule,
  MatTooltipModule,
  MatSidenavModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatAutocompleteModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatTableModule
} from '@angular/material';

export const EXPORTS = [
  FormsModule,
  ReactiveFormsModule,
  NgPipesModule,
  FlexLayoutModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatExpansionModule,
  MatTableModule,
  MatStepperModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatIconModule,
  MatTabsModule,
  MatCardModule,
  MatButtonModule,
  MatTooltipModule,
  MatSidenavModule,
  MatListModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule
];

export const DECLARATIONS = [

];

@NgModule({
  imports: [CommonModule].concat(EXPORTS as any),
  exports: EXPORTS.concat(DECLARATIONS as any),
  declarations: DECLARATIONS
})
export class SharedModule { }
