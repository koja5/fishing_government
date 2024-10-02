import { Component, Input } from "@angular/core";
import { FieldConfig } from "../../../models/field-config";
import { FormGroup } from "@angular/forms";
import { HelpService } from "app/services/help.service";
import { CoreTranslationService } from "@core/services/translation.service";

@Component({
  selector: "app-timepicker",
  templateUrl: "./timepicker.component.html",
  styleUrls: ["./timepicker.component.scss"],
})
export class TimepickerComponent {
  @Input() minuteStep: number;
  public config: FieldConfig;
  public group: FormGroup;
  public language: any;

  constructor(private helpService: HelpService) {
    this.config = new FieldConfig();
    this.group = new FormGroup({});
  }

  ngOnInit(): void {
    this.language = this.helpService.getLanguage();
    this.initialization();
  }

  initialization() {}
}
