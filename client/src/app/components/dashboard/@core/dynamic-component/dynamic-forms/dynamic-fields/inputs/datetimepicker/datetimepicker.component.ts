import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../models/field-config";
import { HelpService } from "app/services/help.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "app-datetimepicker",
  templateUrl: "./datetimepicker.component.html",
  styleUrls: ["./datetimepicker.component.scss"],
})
export class DatetimepickerComponent implements OnInit {
  public config: FieldConfig;
  public group: FormGroup;
  public language: any;
  private _unsubscribeAll: Subject<any>;

  constructor(private helpService: HelpService) {
    this.config = new FieldConfig();
    this.group = new FormGroup({});
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.initialization();
  }

  initialization() {
    // this.formValueChanges();
  }

  formValueChanges() {
    if (this.config.dependent) {
      this.group.valueChanges
        .pipe(this.filterUndefinedValue(this.config.dependent))
        .subscribe((value) => {
          console.log(value);
        });
    }
  }

  filterUndefinedValue(data: any) {
    return data.filter(
      (item) => this.group.controls[item.field].value != undefined
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
