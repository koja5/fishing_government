import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { formatDate } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { FieldConfig } from "./models/field-config";
import { FieldsWithAdditionalInfo } from "./models/fields-with-additional-info";
import { FormConfig } from "./models/form-config";
import { ConfigurationService } from "app/services/configuration.service";
import { CallApiService } from "app/services/call-api.service";
import { MessageService } from "app/services/message.service";
import { pairwise, takeUntil } from "rxjs/operators";
import { CanComponentDeactivate } from "app/services/guards/dirtycheck.guard";
import { Subject } from "rxjs";
import { FieldType } from "app/components/dashboard/enums/field-type";

@Component({
  exportAs: "dynamicForm",
  selector: "app-dynamic-forms",
  templateUrl: "./dynamic-forms.component.html",
  styleUrls: ["./dynamic-forms.component.scss"],
})
export class DynamicFormsComponent implements OnInit, CanComponentDeactivate {
  @Input()
  config!: FormConfig;
  @Input()
  additionalInfo!: FieldsWithAdditionalInfo;
  @Input() path!: string;
  @Input() file!: string;
  @Input() hideActionButtons!: boolean;
  @Input() disableEdit!: boolean;
  @Input() partOfGrid!: boolean;
  @Input() data!: any;

  @Output()
  public submit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChangeData = new EventEmitter<any>();

  form!: FormGroup;
  public loader: boolean = true;
  public modalShow: boolean = false;
  private _unsubscribeAll: Subject<any>;

  isDirty = false;

  get controls() {
    return this.config.config!.filter(({ type }) => type !== "button");
  }
  get changes() {
    this.isDirty = true;
    return this.form.valueChanges;
  }
  get valid() {
    return this.form.valid;
  }
  get value() {
    return this.form.value;
  }

  constructor(
    private fb: FormBuilder,
    private configurationService: ConfigurationService,
    private apiService: CallApiService,
    private _activatedRouter: ActivatedRoute,
    private _messageService: MessageService
  ) {
    this._unsubscribeAll = new Subject();

    this._messageService
      .getConfigValueEmit()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {});
  }

  ngOnInit() {
    if (this.path && this.file && !this.data) {
      this.initializeConfig();
      this.loader = false;
    } else if (this.data && this.hideActionButtons) {
      this.getConfigurationFile();
      this.loader = false;
    } else {
      this.form = this.createGroup();
      this.loader = false;
      if (!this.partOfGrid) {
        if (this.disableEdit) {
          this.setDisableEdit();
        }
        if (this.config.request && !this.data) {
          this.getData(this.config);
        } else {
          this.setValueToForm(this.config.config, this.data);
        }
      }
    }
  }

  public unsavedChanges() {
    return this.isDirty;
  }

  public resetDirty() {
    this.isDirty = false;
  }

  ngOnDestroy() {
    this._unsubscribeAll.unsubscribe();
  }

  initializeConfig() {
    this.configurationService
      .getConfiguration(this.path, this.file)
      .subscribe((data) => {
        this.config = data as FormConfig;
        if (this.disableEdit) {
          this.setDisableEdit();
        }
        if (this.config.actionButtons) {
          this.setDisableEdit();
        }
        this.form = this.createGroup();
        if (this.config.request && !this.data) {
          this.getData(this.config);
        }
        this.checkAdditionallValidation();
      });
  }

  checkAdditionallValidation() {
    for (let i = 0; i < this.config.config.length; i++) {
      if (this.config.config[i].validation) {
        this.form
          .get(this.config.config[i].field)
          .valueChanges.subscribe((data) => {
            this.onChangeData.emit(this.form.value);
          });
      }
    }
  }

  onValueChange(event: any) {
    this.isDirty = true;
  }

  getConfigurationFile() {
    this.configurationService
      .getConfiguration(this.path, this.file)
      .subscribe((data) => {
        this.config = data as FormConfig;
        this.form = this.createGroup();
        this.setValueToForm(this.config.config, this.data);
      });
  }

  getData(data: any) {
    this.apiService.callApi(data, this._activatedRouter).subscribe((data) => {
      this.data = data;
      this.setValueToForm(this.config.config, data);
    });
  }

  setDisableEdit() {
    if (this.config.config) {
      for (let i = 0; i < this.config.config.length; i++) {
        this.config.config[i].readonly = true;
        if (
          this.config.config[i].type === "button" &&
          this.config.config[i].field === "submit"
        ) {
          this.config.config.splice(i, 1);
        } else if (this.config.config[i].type === "radio") {
          this.config.config[i].disabled = true;
        }
      }
    }
  }

  callApiPost(api: string, body: any) {
    this.apiService.callPostMethod(api, body).subscribe((data) => {
      this.data = data;
      this.setValueToForm(this.config.config, data);
    });
  }

  callApiGet(api: string, parameters?: string) {
    this.apiService.callGetMethod(api, parameters!).subscribe((data) => {
      this.data = data;
      this.setValueToForm(this.config.config, data);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.form) {
      const controls = Object.keys(this.form.controls);
      const configControls = this.controls.map((item) => item.name);

      controls
        .filter((control) => !configControls.includes(control))
        .forEach((control) => this.form.removeControl(control));

      configControls
        .filter((control) => !controls.includes(control!))
        .forEach((name) => {
          const config = this.config.config!.find(
            (control) => control.name === name
          );
          this.form.addControl(name!, this.createControl(config!));
        });
      this.onChangeData.emit(this.form.value);
    }
  }

  createGroup() {
    const group = this.fb.group({});
    this.controls.forEach((control) =>
      group.addControl(control.name!, this.createControl(control))
    );
    return group;
  }

  createControl(config: FieldConfig) {
    const { disabled, validation, value } = config;
    return this.fb.control({ disabled, value }, [
      config.required ? Validators.required : Validators.nullValidator,
    ]);
  }

  handleSubmit(event: Event) {
    if (this.form.valid) {
      event.preventDefault();
      event.stopPropagation();
      this.isDirty = false;
      if (
        this.config.editSettingsRequest &&
        this.config.editSettingsRequest.add.formData
      ) {
        const formData = this.packFormData();
        this.submit.emit(formData);
      } else {
        this.submit.emit(this.form.value);
      }
    } else {
      this.form.markAsPending();
    }
  }

  packFormData() {
    let formData = new FormData();

    for (let item of Object.keys(this.value)) {
      if (item === "documentation") {
        if (this.value[item] && this.value[item].files) {
          for (let i = 0; i < this.value[item].files.length; i++) {
            // formData.append("documentation", this.value[item][i]);

            formData.append(
              item,
              this.value[item].files[i],
              this.value[item].files[i].name
            );
          }
        }
      }
      formData.append(item, this.value[item] != null ? this.value[item] : "");
    }

    return formData;
  }

  getKeyFromObject(value) {
    return Object.keys(this.value).find((key) => this.value[key] === value);
  }

  setDisabled(name: string, disable: boolean) {
    if (this.form.controls[name]) {
      const method = disable ? "disable" : "enable";
      this.form.controls[name][method]();
      return;
    }

    this.config.config = this.config.config!.map((item) => {
      if (item.name === name) {
        item.disabled = disable;
      }
      return item;
    });
  }

  setValueToForm(fields: any, values: any) {
    if (values && values.length > 0) {
      for (let k = 0; k < values.length; k++) {
        for (let i = 0; i < fields.length; i++) {
          if (fields[i]["type"] !== FieldType.label) {
            this.setValue(
              fields[i]["name"],
              values[k][fields[i]["name"]],
              fields[i]["type"]
            );
          }
        }
      }
    } else {
      for (let i = 0; i < fields.length; i++) {
        if (fields[i]["type"] !== FieldType.label && values) {
          this.setValue(
            fields[i]["name"],
            values[fields[i]["name"]],
            fields[i]["type"]
          );
        }
      }
    }
    this.loader = false;
  }

  setValue(name: string, value: any, type: string) {
    if (name) {
      if (this.form.controls[name]) {
        if (type === "switch" || type === "checkbox") {
          this.form.controls[name].setValue(this.convertBooleanValue(value), {
            emitEvent: true,
          });
        }
        //  else if (type === "datetimepicker") {
        //   this.form.controls[name].setValue(new Date(value).toUTCString(), {
        //     emitEvent: true,
        //   });
        // }
        else {
          this.form.controls[name].setValue(value, { emitEvent: true });
        }
      }
    }
  }

  convertBooleanValue(value: number) {
    if (value === 1 || value) {
      return true;
    } else {
      return false;
    }
  }

  refreshFormData(event: any) {
    this.data = event;
    this.setValueToForm(this.config.config, event);
  }
}
