import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { DialogConfirmTemplateComponent } from "app/components/dashboard/@core/common/discard-changes-template/discard-changes-template.component";
import { Observable, Subject, of } from "rxjs";
import { map } from "rxjs/operators";

export interface CanComponentDeactivate {
  unsavedChanges(): boolean;
}

@Injectable({
  providedIn: "root",
})
export class DirtycheckGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(
    private _modalService: NgbModal,
    private _translate: TranslateService
  ) {}

  async checkConfirmation(): Promise<boolean> {
    const dialogRef = this._modalService.open(DialogConfirmTemplateComponent, {
      size: "lg",
    });
    dialogRef.componentInstance.confirmMessage =
      "You have unsaved changes. Are you sure to lose changes?";

    dialogRef.result.then((res) => {
      console.log(res);
    });

    let res: boolean = await dialogRef.dismissed.toPromise();

    console.log(dialogRef.componentInstance.confirmed);

    return dialogRef.componentInstance.confirmed;
  }

  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (component.unsavedChanges()) {
      return confirm(this._translate.instant("general.discardChangesText"));
      // let subject = new Subject<boolean>();
      // const modal = this._modalService.open(DialogConfirmTemplateComponent, {
      //   size: "lg",
      // });

      // // modal.componentInstance.subject = subject;
      // // return modal.closed.pipe(map((_) => modal.componentInstance.confirmed));
      // // return subject.asObservable();

      // this.checkConfirmation();
      // // subject = modal.componentInstance.confirmed;
      // // return subject;
    }

    // return component.canDeactivate();
  }
}
