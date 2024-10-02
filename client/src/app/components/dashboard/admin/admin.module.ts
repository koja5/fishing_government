import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { AllFsdOrgansComponent } from "./all-fsd-organs/all-fsd-organs.component";
import { DynamicModule } from "../@core/dynamic-component/dynamic.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { FsdOrganDetailsComponent } from "./all-fsd-organs/fsd-organ-details/fsd-organ-details.component";
import { CustomCommonModule } from "../@core/common/custom-common.module";

const routes: Routes = [
  {
    path: "all-fsd-organs",
    component: AllFsdOrgansComponent,
  },
  {
    path: "fsd-organ-details",
    component: FsdOrganDetailsComponent,
  },
];

@NgModule({
  declarations: [AllFsdOrgansComponent, FsdOrganDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DynamicModule,
    CustomCommonModule
  ],

  bootstrap: [],
})
export class AdminModule {}
