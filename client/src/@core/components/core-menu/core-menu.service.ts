import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { BehaviorSubject, Observable, Subject } from "rxjs";

import { StorageService } from "app/services/storage.service";
import { HelpService } from "app/services/help.service";
import { AuthenticationService } from "app/components/auth/services";
import { UserModel } from "app/components/models/user";
import { UserTypes } from "app/components/dashboard/enums/user-types";

@Injectable({
  providedIn: "root",
})
export class CoreMenuService {
  currentUser: UserModel;
  onItemCollapsed: Subject<any>;
  onItemCollapseToggled: Subject<any>;

  // Private
  private _onMenuRegistered: BehaviorSubject<any>;
  private _onMenuUnregistered: BehaviorSubject<any>;
  private _onMenuChanged: BehaviorSubject<any>;
  private _currentMenuKey: string;
  private _registry: { [key: string]: any } = {};
  private _registryLocal: { [key: string]: any } = {};

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(
    private _router: Router,
    private _authenticationService: AuthenticationService,
    private _storageService: StorageService,
    private _helpService: HelpService
  ) {
    this._authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );

    // Set defaults
    this.onItemCollapsed = new Subject();
    this.onItemCollapseToggled = new Subject();

    // Set private defaults
    this._currentMenuKey = null;
    this._onMenuRegistered = new BehaviorSubject(null);
    this._onMenuUnregistered = new BehaviorSubject(null);
    this._onMenuChanged = new BehaviorSubject(null);
  }

  // Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * onMenuRegistered
   *
   * @returns {Observable<any>}
   */
  get onMenuRegistered(): Observable<any> {
    return this._onMenuRegistered.asObservable();
  }

  /**
   * onMenuUnregistered
   *
   * @returns {Observable<any>}
   */
  get onMenuUnregistered(): Observable<any> {
    return this._onMenuUnregistered.asObservable();
  }

  /**
   * onMenuChanged
   *
   * @returns {Observable<any>}
   */
  get onMenuChanged(): Observable<any> {
    return this._onMenuChanged.asObservable();
  }

  // Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register the provided menu with the provided key
   *
   * @param key
   * @param menu
   */
  register(key, menu): void {
    // Confirm if the key already used
    if (this._registry[key]) {
      console.error(
        `Menu with the key '${key}' already exists. Either unregister it first or use a unique key.`
      );

      return;
    }

    // Add to registry
    this._registry[key] = menu;

    // Notify subject
    this._onMenuRegistered.next([key, menu]);
  }

  /**
   * Unregister the menu from the registry
   *
   * @param key
   */
  unregister(key): void {
    // Confirm if the menu exists
    if (!this._registry[key]) {
      console.warn(`Menu with the key '${key}' doesn't exist in the registry.`);
    }

    // Unregister sidebar
    delete this._registry[key];

    // Notify subject
    this._onMenuUnregistered.next(key);
  }

  /**
   * Get menu from registry by key
   *
   * @param key
   * @returns {any}
   */
  getMenu(key): any {
    // Confirm if the menu exists
    if (!this._registry[key]) {
      console.warn(`Menu with the key '${key}' doesn't exist in the registry.`);

      return;
    }

    this._registryLocal[key] = this._helpService.copyObject(
      this._registry[key]
    );

    this.checkMenuForDifferentUser(key);

    // Return sidebar
    return this._registryLocal[key];
  }

  /**
   * Get current menu
   *
   * @returns {any}
   */
  getCurrentMenu(): any {
    if (!this._currentMenuKey) {
      console.warn(`The current menu is not set.`);

      return;
    }

    return this.getMenu(this._currentMenuKey);
  }

  /**
   * Set menu with the key as the current menu
   *
   * @param key
   */
  setCurrentMenu(key): void {
    // Confirm if the sidebar exists
    if (!this._registry[key]) {
      console.warn(`Menu with the key '${key}' doesn't exist in the registry.`);

      return;
    }

    // Set current menu key
    this._currentMenuKey = key;

    // Notify subject
    this._onMenuChanged.next(key);
  }

  checkMenuForDifferentUser(key) {
    const user = this._storageService.getDecodeToken();
    for (let i = 0; i < this._registryLocal[key].length; i++) {
      if (
        this._registryLocal[key][i].users &&
        this.checkUserType(this._registryLocal[key][i].users, user.type)
      ) {
        this._registryLocal[key].splice(i, 1);
        i--;
      }
    }
  }

  checkUserType(users: any, type: any) {
    for (let i = 0; i < users.length; i++) {
      if (users[i] === UserTypes[type]) {
        return false;
      }
    }
    return true;
  }
}
