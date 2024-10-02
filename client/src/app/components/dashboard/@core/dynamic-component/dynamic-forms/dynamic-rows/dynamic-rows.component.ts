import { Component } from "@angular/core";
import { FieldConfig } from "../models/field-config";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-dynamic-rows",
  templateUrl: "./dynamic-rows.component.html",
  styleUrls: ["./dynamic-rows.component.scss"],
})
export class DynamicRowsComponent {
  public config: FieldConfig;
  public group: FormGroup;
  constructor() {
    this.config = new FieldConfig();
    this.group = new FormGroup({});
  }

  ngOnInit(): void {}
}
