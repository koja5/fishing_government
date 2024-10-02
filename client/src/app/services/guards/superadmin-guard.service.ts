import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { StorageService } from "../storage.service";
import { HelpService } from "../help.service";
import { UserTypes } from "app/components/dashboard/enums/user-types";

@Injectable({
  providedIn: "root",
})
export class SuperadminGuardService {
  constructor(
    public _router: Router,
    public _storageService: StorageService,
    private _helpService: HelpService
  ) {}

  canActivate() {
    const user = this._storageService.getDecodeToken();
    if (user.type === UserTypes.superadmin) {
      return true;
    } else {
      this._helpService.setLocalStorage("previousLink", window.location.href);
      this._router.navigate(["./dashboard/miscellaneous/not-authorized"]);
      return false;
    }
  }
}
