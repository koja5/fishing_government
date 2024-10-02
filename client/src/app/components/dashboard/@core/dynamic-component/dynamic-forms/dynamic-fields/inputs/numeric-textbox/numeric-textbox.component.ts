import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../models/field-config";

@Component({
  selector: "app-numeric-textbox",
  templateUrl: "./numeric-textbox.component.html",
  styleUrls: ["./numeric-textbox.component.sass"],
})
export class NumericTextboxComponent implements OnInit {
  public config: FieldConfig;
  public group: FormGroup;

  constructor() {
    this.config = new FieldConfig();
    this.group = new FormGroup({});
  }

  ngOnInit(): void {}
}
