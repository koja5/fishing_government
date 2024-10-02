import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ToastrComponent } from "app/components/dashboard/@core/common/toastr/toastr.component";
import { DynamicFormsComponent } from "app/components/dashboard/@core/dynamic-component/dynamic-forms/dynamic-forms.component";
import { CallApiService } from "app/services/call-api.service";
import { CanComponentDeactivate } from "app/services/guards/dirtycheck.guard";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements CanComponentDeactivate {
  @ViewChild("form") form: DynamicFormsComponent;
  public path = "forms/general/settings";
  public file = "change-password.json";

  constructor(
    private _service: CallApiService,
    private _toastr: ToastrComponent,
    private _translate: TranslateService
  ) {}

  unsavedChanges(): boolean {
    return this.form.unsavedChanges();
  }

  resetPassword(event) {
    console.log(event);
    if (event.oldPassword === event.newPassword) {
      this._toastr.showWarningCustom(
        this._translate.instant("resetPassword.oldAndNewPasswordCannotBeSame")
      );
    } else if (event.newPassword !== event.repeatNewPassword) {
      this._toastr.showWarningCustom(
        this._translate.instant("resetPassword.passwordsNeedToBeSame")
      );
    } else {
      this._service
        .callPostMethod("/api/changePassword", event)
        .subscribe((data) => {
          if (data) {
            this._toastr.showSuccessCustom(
              this._translate.instant(
                "resetPassword.successfulyChangedPassword"
              )
            );
          } else {
            this._toastr.showWarningCustom(
              this._translate.instant("resetPassword.oldPasswordIsWrong")
            );
          }
        });
    }
  }
}
