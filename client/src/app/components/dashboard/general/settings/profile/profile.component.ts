import { Component, ViewChild } from "@angular/core";
import { ToastrComponent } from "app/components/dashboard/@core/common/toastr/toastr.component";
import { DynamicFormsComponent } from "app/components/dashboard/@core/dynamic-component/dynamic-forms/dynamic-forms.component";
import { CallApiService } from "app/services/call-api.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent {
  @ViewChild("form") form: DynamicFormsComponent;
  public path = "forms/general/settings";
  public file = "profile.json";
  public data: any;

  constructor(
    private _service: CallApiService,
    private _toastr: ToastrComponent
  ) {}

  unsavedChanges(): boolean {
    return this.form.unsavedChanges();
  }

  submit(event: any) {
    if (event.type != "submit") {
      this._service
        .callPostMethod("api/saveProfile", event)
        .subscribe((data) => {
          if (data) {
            this._toastr.showSuccess();
          } else {
            this._toastr.showError();
          }
        });
    }
  }
}
