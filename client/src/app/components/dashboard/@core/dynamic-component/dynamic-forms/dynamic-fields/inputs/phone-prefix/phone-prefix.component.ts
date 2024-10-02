import { Component } from "@angular/core";
import { FieldConfig } from "../../../models/field-config";
import { FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-phone-prefix",
  templateUrl: "./phone-prefix.component.html",
  styleUrls: ["./phone-prefix.component.scss"],
})
export class PhonePrefixComponent {
  public config: FieldConfig;
  public group: FormGroup;
  public country = "at";

  constructor(private _translate: TranslateService) {
    this.config = new FieldConfig();
    this.group = new FormGroup({});
  }

  ngOnInit() {
    if (this._translate.currentLang === "de") {
      this.country = "at";
    } else if (this._translate.currentLang === "en") {
      this.country = "us";
    } else {
      this.country = this._translate.currentLang;
    }
  }
}
