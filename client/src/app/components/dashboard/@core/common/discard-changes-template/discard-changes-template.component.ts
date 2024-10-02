import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-discard-changes-template",
  templateUrl: "./discard-changes-template.component.html",
  styleUrls: ["./discard-changes-template.component.scss"],
})
export class DialogConfirmTemplateComponent {
  public confirmed = false;

  constructor(private _modalService: NgbModal) {}

  confirmAction() {
    this.confirmed = true;
    this._modalService.dismissAll();
  }

  cancelAction() {}
}
