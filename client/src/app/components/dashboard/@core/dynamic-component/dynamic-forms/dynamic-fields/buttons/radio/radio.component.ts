import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../models/field-config";

@Component({
  selector: "app-radio",
  templateUrl: "./radio.component.html",
  styleUrls: ["./radio.component.scss"],
})
export class RadioComponent {
  public config: FieldConfig;
  public group: FormGroup;

  constructor() {
    this.config = new FieldConfig();
    this.group = new FormGroup({});
  }
}
