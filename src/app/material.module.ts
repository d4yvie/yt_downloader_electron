import { NgModule } from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { snackbarConfig } from "./electron-component";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import {
  ErrorStateMatcher,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  ShowOnDirtyErrorStateMatcher
} from "@angular/material/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatCardModule } from "@angular/material/card";
import { MatBadgeModule } from "@angular/material/badge";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDividerModule } from "@angular/material/divider";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatChipsModule } from "@angular/material/chips";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatListModule } from "@angular/material/list";
import { MatStepperModule } from "@angular/material/stepper";

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatTableModule,
    MatTabsModule,
    MatCardModule,
    MatBadgeModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatPaginatorModule,
    MatRadioModule,
    MatListModule,
    DragDropModule,
    MatStepperModule,
    MatProgressBarModule,
  ],
  providers: [
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    /*
    { provide: DateAdapter, useClass: GermanDateAdapter },
    */
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: snackbarConfig },
  ]
}) export class MaterialModule {}
