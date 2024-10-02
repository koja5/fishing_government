import { Component, Input } from "@angular/core";

@Component({
  selector: "app-no-data-content",
  templateUrl: "./no-data-content.component.html",
  styleUrls: ["./no-data-content.component.scss"],
})
export class NoDataContentComponent {
  @Input() text?: string;
  @Input() image?: string;
}
