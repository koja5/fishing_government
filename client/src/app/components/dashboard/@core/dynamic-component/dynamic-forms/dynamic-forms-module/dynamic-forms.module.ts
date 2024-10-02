import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DynamicFieldsDirective } from "../dynamic-fields/dynamic-fields.directive";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TextBoxComponent } from "../dynamic-fields/inputs/text-box/text-box.component";
import { LabelComponent } from "../dynamic-fields/label/label.component";
import { ButtonComponent } from "../dynamic-fields/buttons/button/button.component";
import { SwitchComponent } from "../dynamic-fields/buttons/switch/switch.component";
import { ComboboxComponent } from "../dynamic-fields/dropdowns/combobox/combobox.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { MultiselectComponent } from "../dynamic-fields/dropdowns/multiselect/multiselect.component";
import { TimepickerComponent } from "../dynamic-fields/inputs/timepicker/timepicker.component";
import {
  DatePickerModule,
  DateTimePickerModule,
} from "@syncfusion/ej2-angular-calendars";
import { TranslateModule } from "@ngx-translate/core";
import { DatepickerComponent } from "../dynamic-fields/inputs/datepicker/datepicker.component";
import { PasswordBoxComponent } from "../dynamic-fields/inputs/text-box/password-box/password-box.component";
import { ColorPickerComponent } from "../dynamic-fields/inputs/color-picker/color-picker.component";
import { RadioComponent } from "../dynamic-fields/buttons/radio/radio.component";
import { ExplanationMarkComponent } from "../dynamic-fields/common/explanation-mark/explanation-mark.component";
import { PhonePrefixComponent } from "../dynamic-fields/inputs/phone-prefix/phone-prefix.component";
import { InternationalPhoneModule } from "ng4-intl-phone";
import { DatetimepickerComponent } from "../dynamic-fields/inputs/datetimepicker/datetimepicker.component";
import { NumericTextboxComponent } from "../dynamic-fields/inputs/numeric-textbox/numeric-textbox.component";
import { CoreCommonModule } from "@core/common.module";
import { CoreSidebarModule } from "@core/components";
import { DynamicFormsComponent } from "../dynamic-forms.component";
import { DynamicRowsComponent } from "../dynamic-rows/dynamic-rows.component";
import { CustomCommonModule } from "../../../common/custom-common.module";

@NgModule({
  declarations: [
    DynamicFormsComponent,
    DynamicFieldsDirective,
    TextBoxComponent,
    PasswordBoxComponent,
    NumericTextboxComponent,
    LabelComponent,
    ButtonComponent,
    SwitchComponent,
    RadioComponent,
    ComboboxComponent,
    MultiselectComponent,
    TimepickerComponent,
    DatepickerComponent,
    DatetimepickerComponent,
    ColorPickerComponent,
    ExplanationMarkComponent,
    PhonePrefixComponent,
    DynamicRowsComponent,
  ],
  exports: [
    DynamicFormsComponent,
    DynamicFieldsDirective,
    TextBoxComponent,
    PasswordBoxComponent,
    NumericTextboxComponent,
    LabelComponent,
    ButtonComponent,
    SwitchComponent,
    RadioComponent,
    ComboboxComponent,
    MultiselectComponent,
    TimepickerComponent,
    DatepickerComponent,
    DatetimepickerComponent,
    ColorPickerComponent,
    ExplanationMarkComponent,
    PhonePrefixComponent,
    DynamicRowsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    TranslateModule,
    DatePickerModule,
    DateTimePickerModule,
    InternationalPhoneModule,
    CustomCommonModule,
    CoreSidebarModule,
  ],
  entryComponents: [
    DynamicFormsComponent,
    DynamicFieldsDirective,
    TextBoxComponent,
    PasswordBoxComponent,
    NumericTextboxComponent,
    LabelComponent,
    ButtonComponent,
    SwitchComponent,
    RadioComponent,
    ComboboxComponent,
    MultiselectComponent,
    TimepickerComponent,
    DatepickerComponent,
    DatetimepickerComponent,
    ColorPickerComponent,
    PhonePrefixComponent,
    DynamicRowsComponent,
  ],
})
export class DynamicFormsModule {}
