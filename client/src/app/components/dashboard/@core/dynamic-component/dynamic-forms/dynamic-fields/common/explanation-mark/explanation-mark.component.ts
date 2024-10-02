import { Component, Input } from "@angular/core";

@Component({
  selector: "app-explanation-mark",
  templateUrl: "./explanation-mark.component.html",
  styleUrls: ["./explanation-mark.component.scss"],
})
export class ExplanationMarkComponent {
  @Input() explanation!: any;
  @Input() fontSize: string = "";
}
