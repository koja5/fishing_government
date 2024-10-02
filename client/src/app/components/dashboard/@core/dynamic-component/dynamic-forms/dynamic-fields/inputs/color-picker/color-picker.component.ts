import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../models/field-config";

@Component({
  selector: "app-color-picker",
  templateUrl: "./color-picker.component.html",
  styleUrls: ["./color-picker.component.scss"],
})
export class ColorPickerComponent {
  public config: FieldConfig;
  public group: FormGroup;
  constructor() {
    this.config = new FieldConfig();
    this.group = new FormGroup({});
  }

  ngOnInit(): void {}
}
