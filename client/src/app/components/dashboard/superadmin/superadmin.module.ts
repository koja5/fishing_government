import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { DynamicModule } from "../@core/dynamic-component/dynamic.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { CustomCommonModule } from "../@core/common/custom-common.module";
import { AllUsersComponent } from "./all-users/all-users.component";

const routes: Routes = [
  {
    path: "all-users",
    component: AllUsersComponent,
  },
];

@NgModule({
  declarations: [AllUsersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgSelectModule,
    DynamicModule,
  ],

  bootstrap: [],
})
export class SuperadminModule {}
