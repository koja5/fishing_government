import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { AdminGuardService } from "app/services/guards/admin-guard.service";
import { SettingsComponent } from "./general/settings/settings.component";

const routes: Routes = [
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "superadmin",
    loadChildren: () =>
      import("./superadmin/superadmin.module").then((m) => m.SuperadminModule),
  },
  {
    path: "settings",
    component: SettingsComponent,
    loadChildren: () =>
      import("./general/settings/settings.module").then(
        (m) => m.SettingsModule
      ),
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],

  bootstrap: [],
})
export class DashboardModule {}
