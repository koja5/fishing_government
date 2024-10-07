import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { CoreConfigService } from "@core/services/config.service";
import { CallApiService } from "app/services/call-api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ResponseModel } from "app/components/models/response-model";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ResetPasswordComponent implements OnInit {
  public coreConfig: any;
  public passwordTextType: boolean;
  public confPasswordTextType: boolean;
  public resetPasswordForm: UntypedFormGroup;
  public submitted = false;
  public response = new ResponseModel();

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: UntypedFormBuilder,
    private _service: CallApiService,
    private _activateRouter: ActivatedRoute,
    private _router: Router
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
    return this.resetPasswordForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  /**
   * Toggle confirm password
   */
  toggleConfPasswordTextType() {
    this.confPasswordTextType = !this.confPasswordTextType;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.resetPassword();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.resetPasswordForm = this._formBuilder.group({
      newPassword: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
    });

    // Subscribe to config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
      });

    this.checkIfMailExists();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  checkIfMailExists() {
    this._service
      .callGetMethod(
        "/api/auth/checkIfMailExists",
        this._activateRouter.snapshot.params.email
      )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (data) => {
          if (data) {
            return;
          } else {
            this._router.navigate(["/miscellaneous/something-happened"]);
          }
        },
        (error) => {
          this._router.navigate(["/miscellaneous/something-happened"]);
        }
      );
  }

  resetPassword() {
    this.response = new ResponseModel();
    if (
      this.resetPasswordForm.value.newPassword ===
      this.resetPasswordForm.value.confirmPassword
    ) {
      const body = {
        password: this.resetPasswordForm.value.newPassword,
        email: this._activateRouter.snapshot.params.email,
      };
      this._service
        .callPostMethod("/api/auth/resetPassword", body)
        .subscribe((data) => {
          if (data) {
            this.response.changedPasswordSuccessfuly = true;
            setTimeout(() => {
              this._router.navigate(["/auth/login"]);
            }, 3000);
          }
        });
    } else {
      this.response.passwordNotMatch = true;
    }
  }
}
