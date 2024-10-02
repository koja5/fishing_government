import { Component } from "@angular/core";
import { CallApiService } from "app/services/call-api.service";

@Component({
  selector: "app-fsd-organs",
  templateUrl: "./all-fsd-organs.component.html",
  styleUrls: ["./all-fsd-organs.component.scss"],
})
export class AllFsdOrgansComponent {
  public path = "grids/admin";
  public file = "all-fsd-organs.json";
  public data: any;
  public loader = false;

  constructor(private _service: CallApiService) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    // this.loader = false;
    // // this._service.callGetMethod("/api/admin/getAllFsdOrgans").subscribe((data) => {
    // //   this.data = data;
    // //   this.loader = false;
    // // });
  }
}
