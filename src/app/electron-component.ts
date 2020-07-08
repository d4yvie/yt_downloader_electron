import { OnDestroy } from '@angular/core';
import { Subscription, TeardownLogic } from "rxjs";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBarConfig } from "@angular/material/snack-bar";

/**
 * Manages Subscriptions which are unsubscribed when a Component, Directive or Module specific Service is destroyed.
 * Also see https://angular.io/api/core/OnDestroy
 * @author David Yesil
 */
export class ElectronComponent implements OnDestroy {

  private readonly subscriptions = new Subscription();
  private readonly interValId = setInterval(() => {}, 500);

  /**
   * @author David Yesil
   */
  addSubscription(teardown: TeardownLogic): Subscription {
    return this.subscriptions.add(teardown);
  }

  /**
   * @author David Yesil
   */
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    clearInterval(this.interValId);
  }

  /**
   * @author David Yesil
   */
  protected unsubscribe(): void {
    this.subscriptions.unsubscribe();
  }
}

/**
 * Represents a component which can display a dialogue. Used to cancel the dialogue of the component is destroyed or another dialogue
 * is opened
 * @author David Yesil
 */
export class DialogComponent extends ElectronComponent implements OnDestroy {

  private dialogRef: MatDialogRef<any>;
  private dialogOpen = false;

  constructor(protected readonly dialog: MatDialog) {
    super();
  }

  /**
   * @author David Yesil
   */
  ngOnDestroy() {
    this.unsubscribe();
    this.closeDialog();
  }

  /**
   * @author David Yesil
   */
  openDialog(modal: any, height: string, width: string, data?: any) {
    if (this.dialogOpen) {
      this.closeDialog();
    }
    if (!this.dialogOpen) {
      this.dialogOpen = true;
      this.dialogRef = this.dialog.open(modal, {
        height,
        width,
        data,
      });
    }
  }

  /**
   * @author David Yesil
   */
  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogOpen = false;
    }
  }
}

/**
 * Default snackbar-Configuration
 * @author David Yesil
 */
export const snackbarConfig: MatSnackBarConfig<any> = {
  duration: 5000, panelClass: ['info-snackbar'], verticalPosition: 'top'
};
