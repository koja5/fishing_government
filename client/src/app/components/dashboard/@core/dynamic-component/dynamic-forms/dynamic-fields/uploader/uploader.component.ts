import { Component, ElementRef, TemplateRef, ViewChild } from "@angular/core";
import { FieldConfig } from "../../models/field-config";
import { FormGroup } from "@angular/forms";
import { CallApiService } from "app/services/call-api.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { distinctUntilChanged } from "rxjs/operators";
import { MessageService } from "app/services/message.service";
import { DialogConfirmComponent } from "app/components/dashboard/@core/common/dialog-confirm/dialog-confirm.component";

@Component({
  selector: "app-uploader",
  templateUrl: "./uploader.component.html",
  styleUrls: ["./uploader.component.scss"],
})
export class UploaderComponent {
  @ViewChild("previewFileModal") previewFileModal: TemplateRef<any>;
  @ViewChild("videoPlayer") videoplayer: ElementRef;
  @ViewChild("dialogConfirmRemoveFile")
  dialogConfirmRemoveFile: DialogConfirmComponent;
  public config: FieldConfig;
  public group: FormGroup;
  public savedFiles = [];
  files: any[] = [];
  public modalDialog: any;
  public previewFile!: string;
  public savedFileList: FormGroup;
  public selectedFile: any;

  constructor(
    private _service: CallApiService,
    private _modalService: NgbModal,
    private _messageService: MessageService
  ) {
    this.config = new FieldConfig();
    this.group = new FormGroup({});
  }

  ngOnInit() {
    this.savedFiles = [];
    this.group.controls[this.config.name].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        this.packFiles(value);
      });
  }

  packFiles(documentation) {
    if (typeof documentation === "string" || documentation === null) {
      this.savedFiles = [];
      if (documentation && documentation != "null") {
        let files = documentation.split(";");
        for (let i = 0; i < files.length; i++) {
          this.savedFiles.push(files[i]);
        }
      }
    }
  }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFiles(index: number) {
    let formData = new FormData();

    for (let i = 0; i < this.files.length; i++) {
      formData.append("files[]", this.files[i], this.files[i].name);
    }

    this.group.controls[this.config.name].setValue({ files: this.files });

    // this._service
    //   .callPostMethod("api/uploader/upload", formData)
    //   .subscribe((data) => {
    //     console.log(data);
    //   });
    // setTimeout(() => {
    //   if (index === this.files.length) {
    //     return;
    //   } else {
    //     const progressInterval = setInterval(() => {
    //       if (this.files[index].progress === 100) {
    //         clearInterval(progressInterval);
    //         this.uploadFilesSimulator(index + 1);
    //       } else {
    //         this.files[index].progress += 5;
    //       }
    //     }, 200);
    //   }
    // }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFiles(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  openPreviewFileModal(file: string) {
    this.previewFile = file;
    this.modalDialog = this._modalService.open(this.previewFileModal, {
      centered: true,
      windowClass: "modal modal-default",
      size: "md",
    });
  }

  openPDF(pdf: string) {
    window.open(window.location.origin + "/assets/file-storage/" + pdf);
  }

  dialogConfirmRemoveFileShow(item) {
    this.selectedFile = item;
    this.dialogConfirmRemoveFile.showQuestionModal();
  }

  preparedRemoveFile() {
    let newValue = this.group.controls[this.config.name].value.replace(
      this.selectedFile,
      ""
    );
    if (newValue.slice(-1) === ";") {
      newValue = newValue.slice(0, -1);
    } else if (newValue.slice(0, 1) === ";") {
      newValue = newValue.slice(1);
    } else if (newValue.indexOf(";;") != -1) {
      newValue = newValue.replace(";;", ";");
    }
    this.group.controls[this.config.name].setValue(newValue);
    this.group.value[this.config.name] = newValue;
    this.packFiles(newValue);
  }

  confirmRemoveFile() {
    this.preparedRemoveFile();
    this._service
      .callPostMethod(
        "/api/uploader/deleteObservationSheetFile",
        this.group.value
      )
      .subscribe((data) => {
        if (data) {
          this._messageService.sendRefreshGrid(this.group.value);
        }
      });
  }
}
