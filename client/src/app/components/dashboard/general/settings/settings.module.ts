import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DirtycheckGuard } from "app/services/guards/dirtycheck.guard";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ProfileComponent } from "./profile/profile.component";
import { SettingsComponent } from "./settings.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { DynamicModule } from "../../@core/dynamic-component/dynamic.module";
import { CustomCommonModule } from "../../@core/common/custom-common.module";

const routes = [
  {
    path: "profile",
    component: ProfileComponent,
    canDeactivate: [DirtycheckGuard],
  },
  {
    path: "change-password",
    component: ChangePasswordComponent,
    canDeactivate: [DirtycheckGuard],
  },
];

@NgModule({
  declarations: [ProfileComponent, SettingsComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DynamicModule,
    CustomCommonModule,
  ],

  providers: [],
  exports: [RouterModule],
})
export class SettingsModule {}
