import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { DialogConfirmComponent } from "./dialog-confirm/dialog-confirm.component";
import { ToastrComponent } from "./toastr/toastr.component";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { DialogConfirmTemplateComponent } from "./discard-changes-template/discard-changes-template.component";
import { LoaderComponent } from "./loader/loader.component";
import { NoDataComponent } from "./no-data/no-data.component";
import { GoBackComponent } from "./go-back/go-back.component";
import { NoDataContentComponent } from "./no-data-content/no-data-content.component";

const appRoutes: Routes = [];

@NgModule({
  declarations: [
    DialogConfirmComponent,
    ToastrComponent,
    DialogConfirmTemplateComponent,
    LoaderComponent,
    NoDataComponent,
    GoBackComponent,
    NoDataContentComponent,
  ],
  imports: [CommonModule, TranslateModule],
  providers: [],
  bootstrap: [],
  exports: [
    DialogConfirmComponent,
    ToastrComponent,
    DialogConfirmTemplateComponent,
    LoaderComponent,
    NoDataComponent,
    GoBackComponent,
    NoDataContentComponent,
  ],
})
export class CustomCommonModule {}
