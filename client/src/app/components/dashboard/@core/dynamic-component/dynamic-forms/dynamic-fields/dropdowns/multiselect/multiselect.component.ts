import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ConfigurationFile } from "../../../models/complex-properties/configuration-file";
import { FieldConfig } from "../../../models/field-config";
import { ConfigurationService } from "app/services/configuration.service";
import { CallApiService } from "app/services/call-api.service";

@Component({
  selector: "app-multiselect",
  templateUrl: "./multiselect.component.html",
  styleUrls: ["./multiselect.component.scss"],
})
export class MultiselectComponent implements OnInit {
  public config: FieldConfig;
  public group: FormGroup;

  public data: any;

  constructor(
    private callApi: CallApiService,
    private configurationService: ConfigurationService
  ) {
    this.config = new FieldConfig();
    this.group = new FormGroup({});
  }

  ngOnInit(): void {
    if (this.config.value && typeof this.config.value === "string") {
      if (this.config.value.split(",").length > 0) {
        let arrayValue = this.config.value.split(",");
        let numberValue = [];
        for (let i = 0; i < arrayValue.length; i++) {
          numberValue.push(Number(arrayValue[i]));
        }
        this.config.value = numberValue;
      } else {
        this.config.value = Number(this.config.value);
      }
    }
    if (this.config.data && this.config.data["translation"]) {
      this.config.field = this.config.data["translation"]["fields"];
    } else {
      this.initialization();
    }
  }

  initialization() {
    if (this.config.request!.localData) {
      this.getLocalData(this.config.request!.localData);
    } else {
      if (this.config.request!.type === "POST") {
      } else {
        this.getApiRequest();
      }
    }
  }

  postApiRequest() {
    this.callApi.callPostMethod(
      this.config.request!.api,
      this.callApi.packParametarPost(
        this.config.data,
        this.config.request!.fields
      )
    );
  }

  getApiRequest() {
    this.callApi
      .callGetMethod(
        this.config.request!.api,
        this.callApi.packParametarGet(
          this.config.data,
          this.config.request!.fields
        )
      )
      .subscribe((data) => {
        if (this.config.request!.root) {
          // this.data = data[this.config.request!.root];
        } else {
          this.data = data;
        }
      });
  }

  getLocalData(localDataRequest: ConfigurationFile) {
    this.configurationService
      .getConfiguration(localDataRequest.path!, localDataRequest.file!)
      .subscribe((data) => {
        this.data = data;
      });
  }

  createNew(city) {
    alert("Create New Clicked : " + city);
  }
}
