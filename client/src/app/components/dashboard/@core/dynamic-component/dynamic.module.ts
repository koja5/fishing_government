import { NgModule } from "@angular/core";
import { UserListComponent } from "./user/user-list/user-list.component";
import { DynamicFormsModule } from "./dynamic-forms/dynamic-forms-module/dynamic-forms.module";
import { DynamicFormsComponent } from "./dynamic-forms/dynamic-forms.component";
import { CommonModule } from "@angular/common";
import { CoreCommonModule } from "@core/common.module";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { CorePipesModule } from "@core/pipes/pipes.module";
import { CoreDirectivesModule } from "@core/directives/directives";
import { CoreSidebarModule } from "@core/components";
import { ToastrComponent } from "../common/toastr/toastr.component";
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { DynamicTabsComponent } from "./dynamic-tabs/dynamic-tabs.component";
import { ContentHeaderModule } from "app/layout/components/content-header/content-header.module";
import { ExplanationMarkComponent } from "./dynamic-forms/dynamic-fields/common/explanation-mark/explanation-mark.component";
import { DynamicGridComponent } from "./dynamic-grid/dynamic-grid.component";
import { CustomCommonModule } from "../common/custom-common.module";
import { ExportAsModule } from "ngx-export-as";
import { UploaderComponent } from "./dynamic-forms/dynamic-fields/uploader/uploader.component";
import { ProgressComponent } from "./dynamic-forms/dynamic-fields/uploader/progress/progress.component";
import { DatePickerAllModule, DateTimePickerModule } from "@syncfusion/ej2-angular-calendars";

@NgModule({
  declarations: [
    DynamicGridComponent,
    DynamicTabsComponent,
    UploaderComponent,
    ProgressComponent,
  ],
  imports: [
    CommonModule,
    DynamicFormsModule,
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    CoreSidebarModule,
    TranslateModule,
    RouterModule,
    ContentHeaderModule,
    CustomCommonModule,
    ExportAsModule,
    DateTimePickerModule
  ],
  providers: [ToastrComponent],
  exports: [
    DynamicGridComponent,
    DynamicFormsComponent,
    DynamicTabsComponent,
    ExplanationMarkComponent,
  ],
  entryComponents: [
    DynamicFormsComponent,
    DynamicFormsComponent,
    DynamicTabsComponent,
  ],
})
export class DynamicModule {}
