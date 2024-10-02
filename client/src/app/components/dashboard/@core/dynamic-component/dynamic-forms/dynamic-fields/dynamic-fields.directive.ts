import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnInit,
  Type,
  ViewContainerRef,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Field } from "../models/field";
import { FieldConfig } from "../models/field-config";
import { TextBoxComponent } from "./inputs/text-box/text-box.component";
import { ButtonComponent } from "./buttons/button/button.component";
import { SwitchComponent } from "./buttons/switch/switch.component";
import { ComboboxComponent } from "./dropdowns/combobox/combobox.component";
import { MultiselectComponent } from "./dropdowns/multiselect/multiselect.component";
import { LabelComponent } from "./label/label.component";
import { TimepickerComponent } from "./inputs/timepicker/timepicker.component";
import { NumericTextboxComponent } from "./inputs/numeric-textbox/numeric-textbox.component";
import { DatetimepickerComponent } from "./inputs/datetimepicker/datetimepicker.component";
import { DatepickerComponent } from "./inputs/datepicker/datepicker.component";
import { PasswordBoxComponent } from "./inputs/text-box/password-box/password-box.component";
import { ColorPickerComponent } from "./inputs/color-picker/color-picker.component";
import { RadioComponent } from "./buttons/radio/radio.component";
import { PhonePrefixComponent } from "./inputs/phone-prefix/phone-prefix.component";
import { UploaderComponent } from "./uploader/uploader.component";
import { DynamicRowsComponent } from "../dynamic-rows/dynamic-rows.component";

const components: { [type: string]: Type<Field> } = {
  textbox: TextBoxComponent,
  numeric: NumericTextboxComponent,
  password: PasswordBoxComponent,
  label: LabelComponent,
  button: ButtonComponent,
  switch: SwitchComponent,
  radio: RadioComponent,
  combobox: ComboboxComponent,
  multiselect: MultiselectComponent,
  datepicker: DatepickerComponent,
  datetimepicker: DatetimepickerComponent,
  timepicker: TimepickerComponent,
  color: ColorPickerComponent,
  phoneprefix: PhonePrefixComponent,
  uploader: UploaderComponent,
  dynamicRows: DynamicRowsComponent,
};

@Directive({
  selector: "[dynamicField]",
})
export class DynamicFieldsDirective implements Field, OnChanges, OnInit {
  @Input()
  config!: FieldConfig;

  @Input()
  group!: FormGroup;

  @Input()
  data: any;

  component!: ComponentRef<Field>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}

  ngOnChanges() {
    if (this.component) {
      this.component.instance.config = this.config;
      this.component.instance.group = this.group;
    }
  }

  ngOnInit() {
    if (!components[this.config.type]) {
      const supportedTypes = Object.keys(components).join(", ");
      throw new Error(
        `Trying to use an unsupported type (${this.config.type}).
        Supported types: ${supportedTypes}`
      );
    }
    const component = this.resolver.resolveComponentFactory<Field>(
      components[this.config.type]
    );
    this.component = this.container.createComponent(component);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
  }
}
