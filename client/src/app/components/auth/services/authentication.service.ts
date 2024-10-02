import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { StorageService } from "app/services/storage.service";
import { UserModel } from "../models";
import { UserTypes } from "app/components/dashboard/enums/user-types";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  //public
  public currentUser: Observable<UserModel>;

  //private
  private currentUserSubject: BehaviorSubject<UserModel>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(
    private _http: HttpClient,
    private _toastrService: ToastrService,
    private _storageService: StorageService
  ) {
    this.currentUserSubject = new BehaviorSubject<UserModel>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return (
      this.currentUser && this.currentUserSubject.value.type === UserTypes.admin
    );
  }

  /**
   *  Confirms if user is client
   */
  get isSuperadmin() {
    return (
      this.currentUser && this.currentUserSubject.value.type === UserTypes.superadmin
    );
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(email: string, password: string) {
    return this._http
      .post<any>(`${environment.apiUrl}/users/authenticate`, {
        email,
        password,
      })
      .pipe(
        map((user) => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));

            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                "You have successfully logged in as an " +
                  user.role +
                  " user to Fischereiverband. Now you can start to explore. Enjoy! 🎉",
                "👋 Welcome, " + user.firstName + "!",
                { toastClass: "toast ngx-toastr", closeButton: true }
              );
            }, 2500);

            // notify
            this.currentUserSubject.next(user);
          }

          return user;
        })
      );
  }

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    this._storageService.deleteToken();
    // notify
    this.currentUserSubject.next(null);
  }
}
