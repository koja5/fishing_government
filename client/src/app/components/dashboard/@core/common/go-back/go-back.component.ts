import { Component } from "@angular/core";
import { Location } from "@angular/common";

@Component({
  selector: "app-go-back",
  templateUrl: "./go-back.component.html",
  styleUrls: ["./go-back.component.scss"],
})
export class GoBackComponent {
  constructor(private _location: Location) {}

  goBack() {
    this._location.back();
  }
}
