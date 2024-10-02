import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../../models/field-config";
import { HelpService } from "app/services/help.service";
import { CallApiService } from "app/services/call-api.service";
import { Router } from "@angular/router";
import { MessageService } from "app/services/message.service";
import { ToastrComponent } from "app/components/dashboard/@core/common/toastr/toastr.component";
import { DialogConfirmComponent } from "app/components/dashboard/@core/common/dialog-confirm/dialog-confirm.component";
import { ResponseAction } from "app/components/dashboard/enums/response-action";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
})
export class ButtonComponent implements OnInit {
  @Input() class!: string;
  @Input() title!: string;
  @Input() icon!: string;
  @Output() clickEmitter: EventEmitter<any> = new EventEmitter();
  @ViewChild(DialogConfirmComponent) dialogConfirm;
  public config: FieldConfig;
  public group: FormGroup;
  public language: any;

  constructor(
    private _helpService: HelpService,
    private _service: CallApiService,
    private _router: Router,
    private _toastr: ToastrComponent,
    private _messageService: MessageService
  ) {
    this.config = new FieldConfig();
    this.group = new FormGroup({});
  }

  ngOnInit(): void {
    this.language = this._helpService.getLanguage();
  }

  clickButton() {
    this.clickEmitter.emit();
  }

  checkRights() {
    return this._helpService.checkRights(this.config.rights);
  }

  clickRequest() {
    if (this._helpService.checkUndefinedProperty(this.group.value)) {
      if (this.config.emitRequest) {
        this._messageService.sendConfigValueEmit({
          config: this.config,
          value: this.group.value,
        });
      } else {
        this.config.body = this.group.value;
        this._service.callApi(this.config, this._router).subscribe(
          (data) => {
            if (data) {
              if (this.config.responseMessage.type === ResponseAction.toastr) {
                if (
                  this.config.responseMessage.title ||
                  this.config.responseMessage.text
                ) {
                  this._toastr.showSuccessCustom(
                    this.config.responseMessage.title,
                    this.config.responseMessage.text
                  );
                } else {
                  this._toastr.showSuccess();
                }
              }
            } else {
              this._toastr.showError();
            }
          },
          (error) => {
            this._toastr.showError();
          }
        );
      }
    } else {
      this._toastr.showError();
    }
  }
}
