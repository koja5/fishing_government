import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../models/field-config";

@Component({
  selector: "app-text-box",
  templateUrl: "./text-box.component.html",
  styleUrls: ["./text-box.component.scss"],
})
export class TextBoxComponent implements OnInit {
  public config: FieldConfig;
  public group: FormGroup;
  constructor() {
    this.config = new FieldConfig();
    this.group = new FormGroup({});
  }

  ngOnInit(): void {
    if (this.config.replacedValue) {
      for (let i = 0; i < this.config.replacedValue.length; i++) {
        if (this.group.controls[this.config.replacedValue[i].field]) {
          if (this.config.replacedValue[i].operator === "==") {
            if (
              this.group.controls[this.config.replacedValue[i].field].value ==
              this.config.replacedValue[i].value
            ) {
              this.group.controls[this.config.replacedValue[i].field].setValue(
                this.config.replacedValue[i].newValue
              );
            }
          } else if (this.config.replacedValue[i].operator === "!=") {
            if (
              this.group.controls[this.config.replacedValue[i].field].value !=
              this.config.replacedValue[i].value
            ) {
              this.group.controls[this.config.replacedValue[i].field].setValue(
                this.config.replacedValue[i].newValue
              );
            }
          }
        }
      }
    }
  }
}
