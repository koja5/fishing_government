import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  Input,
} from "@angular/core";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FlatpickrOptions } from "ng2-flatpickr";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfigurationService } from "app/services/configuration.service";
import { HelpService } from "app/services/help.service";

@Component({
  selector: "app-dynamic-tabs",
  templateUrl: "./dynamic-tabs.component.html",
  styleUrls: ["./dynamic-tabs.component.scss"],
})
export class DynamicTabsComponent {
  @Input() path!: string;
  @Input() file!: string;
  public contentHeader: object;
  public data: any;

  // private
  private _unsubscribeAll: Subject<any>;
  public activePath: string;
  public config: any;

  /**
   * Constructor
   *
   * @param {AccountSettingsService} _accountSettingsService
   */
  constructor(
    private _configurationService: ConfigurationService,
    private _router: Router,
    private _helpService: HelpService
  ) {
    this._unsubscribeAll = new Subject();
  }

  /**
   * On init
   */
  ngOnInit() {
    this.activePath = window.location.pathname;

    this._configurationService
      .getConfiguration(this.path, this.file)
      .subscribe((config) => {
        this.config = config;
      });

    // content header
    this.contentHeader = {
      headerTitle: "Account Settings",
      actionButton: true,
      breadcrumb: {
        type: "",
        links: [
          {
            name: "Home",
            isLink: true,
            link: "/",
          },
          {
            name: "Pages",
            isLink: true,
            link: "/",
          },
          {
            name: "Account Settings",
            isLink: false,
          },
        ],
      },
    };
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  changeRouter(router: string) {
    this.activePath = router;
    if (router.indexOf("/#") != -1) {
      let parameters = this._helpService.getSessionStorage("parameter")
        ? JSON.parse(this._helpService.getSessionStorage("parameter"))
        : [];
      for (let i = 0; i < parameters.length; i++) {
        router = router.replace('#' + parameters[i].key, parameters[i].value);
      }
    }
    this._router.navigate([router]);
  }
}
