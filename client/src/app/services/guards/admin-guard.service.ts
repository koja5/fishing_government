import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { StorageService } from "../storage.service";
import { HelpService } from "../help.service";
import { UserTypes } from "app/components/dashboard/enums/user-types";

@Injectable({
  providedIn: "root",
})
export class AdminGuardService {
  constructor(
    public _router: Router,
    public _storageService: StorageService,
    private _helpService: HelpService
  ) {}

  canActivate() {
    const user = this._storageService.getDecodeToken();
    if (user.type === UserTypes.admin) {
      return true;
    } else {
      this._helpService.setLocalStorage("previousLink", window.location.href);
      this._router.navigate(["./auth/login"]);
      return false;
    }
  }
}
