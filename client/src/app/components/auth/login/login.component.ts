import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { CoreConfigService } from "@core/services/config.service";
import { CallApiService } from "app/services/call-api.service";
import { StorageService } from "app/services/storage.service";
import { UserTypes } from "app/components/dashboard/enums/user-types";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  //  Public
  public coreConfig: any;
  public loginForm: UntypedFormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = "";
  public passwordTextType: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: UntypedFormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _service: CallApiService,
    private _storageService: StorageService
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // Login
    this.loading = true;

    this._service
      .callPostMethod("/api/auth/login", this.loginForm.value)
      .subscribe((data: any) => {
        if (data && data.token) {
          this._storageService.setToken(data.token);
          // window.open("dashboard/admin", "_self");

          const type = this._storageService.getDecodeToken().type as UserTypes;
          const previousLink =
            this._storageService.getLocalStorage("previousLink");
          if (previousLink) {
            window.open(previousLink, "_self");
            this._storageService.removeLocalStorage("previousLink");
          } else if (type === UserTypes.admin) {
            window.open("/dashboard/admin/all-fsd-organs", "_self");
          } else {
            window.open("/dashboard/superadmin/all-users", "_self");
          }
          // const user = this._storageService.getDecodeToken();
          // if (!user.firstname || !user.lastname) {
          //   // this._router.navigate(["wizard"]);
          //   window.open("wizard", "_self");
          // } else {
          //   // this._router.navigate(["dashboard/admin"]);
          //   window.open("dashboard/admin", "_self");
          // }
          this.loading = false;
        } else {
          this.error = data.type;
          this.loading = false;
        }
      });

    // redirect to home page
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ["", [Validators.required]],
      password: ["", Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams["returnUrl"] || "/";

    // Subscribe to config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
