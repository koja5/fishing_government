import { Component } from "@angular/core";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  //public
  public path = "forms/general/settings";
  public file = "settings.json";
}
