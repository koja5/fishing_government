import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { CoreConfigService } from "@core/services/config.service";
import { CoreSidebarService } from "@core/components/core-sidebar/core-sidebar.service";

import { ConfigurationService } from "app/services/configuration.service";
import { CallApiService } from "app/services/call-api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HelpService } from "app/services/help.service";
import { DynamicFormsComponent } from "../dynamic-forms/dynamic-forms.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { CanComponentDeactivate } from "app/services/guards/dirtycheck.guard";
import { DialogConfirmComponent } from "../../common/dialog-confirm/dialog-confirm.component";
import { ToastrComponent } from "../../common/toastr/toastr.component";
import { ExportAsConfig, ExportAsService } from "ngx-export-as";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { MethodRequest } from "app/components/dashboard/enums/method-request";
import { MessageService } from "app/services/message.service";
import { StorageService } from "app/services/storage.service";
import { GridConfigModel } from "app/components/dashboard/models/grid-config-model";

@Component({
  selector: "app-dynamic-grid",
  templateUrl: "./dynamic-grid.component.html",
  styleUrls: ["./dynamic-grid.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DynamicGridComponent implements CanComponentDeactivate {
  @Input() public path: string;
  @Input() public file: string;
  @Input() public data: any;
  @Input() externalAccounts: any;
  @Input() disabledCreateNew: boolean = false;
  @Input() hideCreateNew: boolean = false;
  @Input() additionalData: any;
  @Input() disableCRUD: boolean = false;
  @Input() template: TemplateRef<any>;
  @Input() initializeGrid = false;
  @Input() modalDialogSize: string;
  @Input() height: string;
  @Output() submit = new EventEmitter();
  @Output() emitValueForCustomForm = new EventEmitter<any>();
  @Output() refreshParentComponent = new EventEmitter();
  @ViewChild("grid") grid: any;
  @ViewChild("modal") modal: TemplateRef<any>;
  @ViewChild("modalForm") modalForm: TemplateRef<any>;
  @ViewChild("modalOptions") modalOptions: TemplateRef<any>;
  @ViewChild("modalGoogleContacts") modalGoogleContacts: TemplateRef<any>;
  @ViewChild("dialogSyncGoogleContactConfirm")
  dialogSyncGoogleContactConfirm: DialogConfirmComponent;
  @ViewChild("dialogUnsavedContentConfirm")
  dialogUnsavedContentConfirm: DialogConfirmComponent;
  @ViewChild(DynamicFormsComponent) form!: DynamicFormsComponent;
  @ViewChild("form") form1: DynamicFormsComponent;

  exportAsConfigToPdf: ExportAsConfig = {
    type: "pdf",
    elementIdOrContent: "export-grid",
  };

  exportAsConfigToCsv: ExportAsConfig = {
    type: "csv",
    elementIdOrContent: "export-grid",
  };

  // Public
  public sidebarToggleRef = false;
  public rows;
  public selectedOption = 11;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = "";
  public previousPlanFilter = "";
  public previousStatusFilter = "";
  public executeActionConfig: any;
  public modalDialog: any;
  public modalFormDialog: any;
  public modalOptionsDialog: any;
  public modalGoogleContactsDialog: any;
  public innerWidth: any;
  public loader = false;
  public loaderContent = false;
  public googleContacts: any;
  public createNewRecords = true;
  public stayOpened = false;
  public editing = null;
  public scrollbarH = false;
  public showExportGrid = false;
  public gridConfig = new GridConfigModel();

  public selectRole: any = [
    { name: "All", value: "" },
    { name: "Admin", value: "Admin" },
    { name: "Author", value: "Author" },
    { name: "Editor", value: "Editor" },
    { name: "Maintainer", value: "Maintainer" },
    { name: "Subscriber", value: "Subscriber" },
  ];

  public selectPlan: any = [
    { name: "All", value: "" },
    { name: "Basic", value: "Basic" },
    { name: "Company", value: "Company" },
    { name: "Enterprise", value: "Enterprise" },
    { name: "Team", value: "Team" },
  ];

  public selectStatus: any = [
    { name: "All", value: "" },
    { name: "Pending", value: "Pending" },
    { name: "Active", value: "Active" },
    { name: "Inactive", value: "Inactive" },
  ];

  public selectedRole = [];
  public selectedPlan = [];
  public selectedStatus = [];
  public searchValue = "";

  //SPECIAL VARIABLES
  public searchRegionValue = {
    id: null,
    name: null,
  };
  public searchFbzValue = {
    id: null,
    name: null,
  };
  public searchTrainingValidValue = {
    id: null,
    name: null,
  };
  public searchValidCardValue = {
    id: null,
    name: null,
  };
  public selectedDropdownFilter: string;
  public allFbz: any;
  public allRegions: any;
  public allDropdownFilterOptions = ["Bezirksverwaltung", "FBZ"];
  public advancedFiltersVisibility = true;
  public searchTrainingValidDate = new Date();
  public searchWholeArea = false;
  public allTrainingValidData = [
    {
      id: 0,
      name: "Fortbildung nicht erfüllt",
    },
    {
      id: 1,
      name: "Fortbildung erfüllt",
    },
  ];

  public allValidCardData = [
    {
      id: 0,
      name: "keine gültige Jahresfischerkarte",
    },
    {
      id: 1,
      name: "Gültige Jahresfischerkarte",
    },
  ];

  //END SPECIAL VARIABLES

  public config: any;

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(
    private _coreSidebarService: CoreSidebarService,
    private _coreConfigService: CoreConfigService,
    private _configurationService: ConfigurationService,
    private _service: CallApiService,
    private _activateRouter: ActivatedRoute,
    private _router: Router,
    private _helpService: HelpService,
    private _toastr: ToastrComponent,
    private _modalService: NgbModal,
    private _translate: TranslateService,
    private exportAsService: ExportAsService,
    private _messageService: MessageService,
    private _storageService: StorageService
  ) {
    this._unsubscribeAll = new Subject();
    this._modalService.dismissAll();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event, checkOtherParameters = true, rows?: any) {
    const val = event.target ? event.target.value.toLowerCase() : event;
    this.searchValue = val;

    this._storageService.setFilterForGrid(
      window.location.pathname,
      this.searchValue
    );
    this.filterData();
  }

  setPage(event) {
    this.gridConfig.offset = event.offset;
    this._storageService.setOffsetForGrid(
      window.location.pathname,
      event.offset
    );
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  toggleSidebarClose(name): void {
    if (this._coreSidebarService.getSidebarRegistry(name)) {
      this._coreSidebarService.getSidebarRegistry(name).close();
    }
  }

  handlerCloseSidebar(event) {
    if (this.form && this.form.unsavedChanges() && event) {
      this.stayOpened = true;
      this.dialogUnsavedContentConfirm.showQuestionModal();
    }
  }

  confirmUnsavedContent() {
    this.stayOpened = false;
    this.form.resetDirty();
    this._coreSidebarService.getSidebarRegistry("sidebar").close();
  }

  cancelUnsavedContent() {
    this.stayOpened = false;
  }

  /**
   * Filter By Roles
   *
   * @param event
   */
  filterByRole(event) {
    const filter = event ? event.value : "";
    this.previousRoleFilter = filter;
    this.temp = this.filterRows(
      filter,
      this.previousPlanFilter,
      this.previousStatusFilter
    );
    this.rows = this.temp;
  }

  /**
   * Filter By Plan
   *
   * @param event
   */
  filterByPlan(event) {
    const filter = event ? event.value : "";
    this.previousPlanFilter = filter;
    this.temp = this.filterRows(
      this.previousRoleFilter,
      filter,
      this.previousStatusFilter
    );
    this.rows = this.temp;
  }

  /**
   * Filter By Status
   *
   * @param event
   */
  filterByStatus(event) {
    const filter = event ? event.value : "";
    this.previousStatusFilter = filter;
    this.temp = this.filterRows(
      this.previousRoleFilter,
      this.previousPlanFilter,
      filter
    );
    this.rows = this.temp;
  }

  /**
   * Filter Rows
   *
   * @param roleFilter
   * @param planFilter
   * @param statusFilter
   */
  filterRows(roleFilter, planFilter, statusFilter): any[] {
    // Reset search on select change
    this.searchValue = "";

    roleFilter = roleFilter.toLowerCase();
    planFilter = planFilter.toLowerCase();
    statusFilter = statusFilter.toLowerCase();

    return this.tempData.filter((row) => {
      const isPartialNameMatch =
        row.role.toLowerCase().indexOf(roleFilter) !== -1 || !roleFilter;
      const isPartialGenderMatch =
        row.currentPlan.toLowerCase().indexOf(planFilter) !== -1 || !planFilter;
      const isPartialStatusMatch =
        row.status.toLowerCase().indexOf(statusFilter) !== -1 || !statusFilter;
      return isPartialNameMatch && isPartialGenderMatch && isPartialStatusMatch;
    });
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.innerWidth = window.innerWidth;

    this.initialize();

    this._messageService
      .getRefreshGrid()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.getData();
      });
  }

  checkGridConfigStorage() {
    this.gridConfig = this._storageService.getLocalStorage(
      window.location.pathname
    );

    if (this.gridConfig) {
      if (this.gridConfig.filter) {
        this.searchValue = this.gridConfig.filter;
      }

      if (this.gridConfig.filterOption) {
        this.selectedDropdownFilter = this.gridConfig.filterOption;
      }

      if (this.gridConfig.region) {
        this.searchRegionValue = this.gridConfig.region;
      }

      if (this.gridConfig.fbz) {
        this.searchFbzValue = this.gridConfig.fbz;
      }

      if (this.gridConfig.offset) {
        this.setPage(this.gridConfig);
      }
      if (this.gridConfig.training) {
        this.searchTrainingValidValue = this.gridConfig.training;
      }
      if (this.gridConfig.date) {
        this.searchTrainingValidDate = this.gridConfig.date;
      }
      if (this.gridConfig.validCard) {
        this.searchValidCardValue = this.gridConfig.validCard;
      }
    }

    this.filterData();
  }

  @HostListener("window:resize", ["$event"])
  onWindowResize() {
    this.checkScrollbarHVisibility();
  }

  checkScrollbarHVisibility() {
    if (
      this._helpService.checkIsMobileDevices() ||
      this.config.columns.length > 6
    ) {
      this.scrollbarH = true;
    } else {
      this.scrollbarH = false;
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  initialize() {
    this.loader = true;
    if (this.path && this.file) {
      this._configurationService
        .getConfiguration(this.path, this.file)
        .subscribe((data) => {
          this.config = data;

          this.checkScrollbarHVisibility();

          if (!this.data || this.data === undefined) {
            if (this.config.regionFilter) {
              this.checkGridConfigStorage();
              this.getItemsForSpecialFilter();
            } else {
              this._coreConfigService.config
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((config) => {
                  if (config.layout.animation === "zoomIn") {
                    setTimeout(() => {
                      this._service
                        .callApi(this.config, this._activateRouter)
                        .subscribe((data) => {
                          this.rows = data;
                          this.tempData = this.rows;
                          this.loader = false;
                        });
                    }, 450);
                  } else {
                    this.getData();
                  }
                });
            }
          } else if (this.data) {
            this.rows = this.data;
            this.tempData = this.rows;
            this.checkGridConfigStorage();
            this.loader = false;
          }
        });
    } else if (this.data) {
      this.rows = this.data;
      this.tempData = this.rows;
      this.loader = false;
    }
  }

  getItemsForSpecialFilter() {
    if (this.config.regionFilter) {
      this.getRegions();
      this.getAllFbz();
    }
  }

  getRegions() {
    this._service
      .callGetMethod("/api/admin/getAllRegions")
      .subscribe((data) => {
        this.allRegions = data;
      });
  }

  getAllFbz() {
    this._service.callGetMethod("/api/admin/getAllFbz").subscribe((data) => {
      this.allFbz = data;
    });
  }

  getData() {
    this.loader = true;
    this._service
      .callApi(this.config, this._activateRouter)
      .subscribe((data) => {
        this.rows = data;
        this.tempData = this.rows;
        this.checkGridConfigStorage();
        this.loader = false;
      });
  }

  submitEmitter(event: any, noCloseEditForm?: boolean) {
    if (
      (this._helpService.checkUndefinedProperty(event) &&
        event.type != "submit") ||
      event instanceof FormData
    ) {
      if (
        this.config.editSettingsRequest &&
        this.config.editSettingsRequest.add.type === MethodRequest.EMIT
      ) {
        this.closeEditForm(noCloseEditForm);
        this.submit.emit(event);
      } else if (this.config.editSettingsRequest.add.type) {
        this.callServerMethod(
          this.config.editSettingsRequest.add,
          event,
          noCloseEditForm
        );
      }
    }
  }

  packAdditionalFields(event, additionalFields) {
    for (let i = 0; i < additionalFields.length; i++) {
      if (additionalFields[i].type === "google-token") {
        event["token"] = this.externalAccounts.google;
      }
    }
    return event;
  }

  callServerMethod(
    request: any,
    event: any,
    noResponseMessage?: boolean,
    noCloseEditForm?: boolean
  ) {
    this.loader = true;
    this._service
      .callServerMethod(request, event, this._activateRouter)
      .subscribe((data: any) => {
        if (data) {
          if (!noResponseMessage) {
            this._toastr.showSuccess();
            this.closeEditForm(noCloseEditForm);
            this.refreshDataFromServer();
          }
        } else {
          this._toastr.showError();
          this.closeEditForm(noCloseEditForm);
          this.loader = false;
        }
      });
  }

  refreshDataFromServer() {
    if (this.config.request) {
      this._service
        .callApi(this.config, this._activateRouter)
        .subscribe((data) => {
          this.loader = false;
          this.setResponseData(data);
        });
    } else {
      this.refreshParentComponent.emit();
    }
  }

  setResponseData(data: any) {
    if (this.config.request.type === "GET") {
      this.rows = data;
      this.submit.emit({
        rows: this.rows,
        total: this.rows.length,
      });
    }
  }

  closeEditForm(noCloseEditForm?: boolean) {
    if (!noCloseEditForm) {
      if (this.config.formDialog.type === "modal") {
        if (!this.config.formDialog.closeAfterExecute) {
          this.modalDialog.close();
        }
      } else {
        if (!this.config.formDialog.closeAfterExecute) {
          this.toggleSidebarClose("sidebar");
        }
      }
    }
  }

  // check here which is action and then check additionall configuration - l
  actionColumn(item, value, row) {
    if (item.routerLink) {
      if (value && item.routerLink.indexOf("{{value}}") != -1) {
        item.routerLink = item.routerLink.replace("{{value}}", value);
      }
      this._router.navigate([item.routerLink]);
    } else if (item.type) {
      if (item.type === "edit" || item.type === "show") {
        this.checkConfigurationFunctionsForEditOption(item, row);
      }

      if (item.executeAction && item.executeAction.showQuestionBeforeExecute) {
        this.executeActionConfig = item.executeAction;
        this.executeActionConfig.body = row;
        this.showQuestionModal(this.modal, item.executeAction.modalConfig);
      }
    }
  }

  checkConfigurationFunctionsForEditOption(item, row) {
    this.executeActionConfig = item.formDialog;
    this.createNewRecords = false;
    setTimeout(() => {
      this.setValue(this.config.config, row);
    }, 50);

    if (!item.config || !item.config.length) {
      this.emitValueForCustomForm.emit(row);
    }

    if (item.formDialog.type === "sidebar") {
      this.toggleSidebar("sidebar");
    } else {
      this.showModalFormDialog();
    }
  }

  resetFormValue() {
    for (let i = 0; i < this.config.config.length; i++) {
      this.form.setValue(
        this.config.config[i]["name"],
        this.config.config[i].value ? this.config.config[i].value : null,
        this.config.config[i]["type"]
      );
    }

    if (!this.config || !this.config.length) {
      this.emitValueForCustomForm.emit(null);
    }
  }

  setValue(fields: any, values: any) {
    for (let i = 0; i < fields.length; i++) {
      this.form.setValue(
        fields[i]["name"],
        values[fields[i]["name"]],
        fields[i]["type"]
      );
    }
  }

  showQuestionModal(modal: TemplateRef<any>, modalConfig) {
    this.modalDialog = this._modalService.open(modal, {
      centered: true,
      windowClass: modalConfig.windowClass
        ? modalConfig.windowClass
        : "modal modal-danger",
    });
  }

  showModalFormDialog() {
    this.modalDialog = this._modalService.open(this.modalForm, {
      centered: true,
      windowClass:
        this.config.formDialog && this.config.formDialog.windowClass
          ? this.config.formDialog.windowClass
          : "modal modal-default",
      size:
        this.config.formDialog && this.config.formDialog.size
          ? this.config.formDialog.size
          : "md",
    });
  }

  showModalOptionsDialog() {
    this.modalOptionsDialog = this._modalService.open(this.modalOptions, {
      centered: true,
      windowClass: "modal modal-default",
      size: "md",
    });
  }

  showModalGoogleContacts() {
    this.modalGoogleContactsDialog = this._modalService.open(
      this.modalGoogleContacts,
      {
        centered: true,
        windowClass: "modal modal-default",
        size: "lg",
      }
    );
  }

  allowExecuteActionFromModal() {
    this.callServerMethod(
      this.executeActionConfig.request,
      this.executeActionConfig.body
    );
    this.modalDialog.close();
  }

  openLink(routerLink: any, data: any) {
    let generateLink = routerLink.link;
    let parameters = [];
    for (let i = 0; i < routerLink.parameters.length; i++) {
      generateLink = generateLink.replace(
        "#" + routerLink.parameters[i],
        data[routerLink.parameters[i]]
      );
      parameters.push({
        key: routerLink.parameters[i],
        value: data[routerLink.parameters[i]],
      });
    }
    if (routerLink.saveParametersInSessionStorage) {
      this._helpService.setSessionStorage("parameter", parameters);
    }
    if (routerLink.newTab) {
      window.open(generateLink);
    } else {
      let queryParams = {};
      if (parameters.length) {
        for (let i = 0; i < parameters.length; i++) {
          queryParams[parameters[i].key] = parameters[i].value;
        }
      }
      this._router.navigate([routerLink.link], {
        queryParams: queryParams,
      });
    }
  }

  toggleExpandRow(row) {
    this.grid.rowDetail.toggleExpandRow(row);
  }

  getGoogleContacts() {
    this.modalOptionsDialog.close();
  }

  unsavedChanges(): boolean {
    return this.form.unsavedChanges();
  }

  exportToPdf() {
    this.showExportGrid = true;
    setTimeout(() => {
      this.showExportGrid = false;
    }, 1);
    this.exportAsService
      .save(this.exportAsConfigToPdf, "data")
      .subscribe(() => {});
  }

  exportToCsv() {
    this.exportAsService
      .save(this.exportAsConfigToCsv, "data")
      .subscribe(() => {
        // save started
      });
  }

  // print() {
  //   const printContents = document.getElementById("grid1").innerHTML;
  //   const WindowObject = window.open(
  //     "",
  //     "PrintWindow",
  //     "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes"
  //   );
  //   const htmlData = `<html><body>${printContents}</body></html>`;

  //   WindowObject.document.writeln(htmlData);
  //   WindowObject.document.close();
  //   WindowObject.focus();
  // }

  print(): void {
    // const printContent = document.getElementById("export-grid")?.innerHTML;
    // const printWindow = window.open("", "", "height=400,width=800");
    // if (printWindow) {
    //   printWindow.document.write("<html><head><title>Print Receipt</title>");
    //   printWindow.document.write("<style>");
    //   printWindow.document.write(
    //     "body { font-family: Arial, sans-serif; width: 80mm; margin: 0; padding: 0; }"
    //   );
    //   printWindow.document.write(".receipt-container { width: 80mm; }");
    //   printWindow.document.write("</style></head><body >");
    //   printWindow.document.write(printContent || "");
    //   printWindow.document.write("</body></html>");
    //   printWindow.document.close();
    //   printWindow.print();
    // }

    var printWindow = window.open("", "");
    printWindow.document.write("<html><head><title>Fischereiverband</title>");

    //Print the Table CSS.
    var table_style = document.getElementById("table_style").innerHTML;
    printWindow.document.write('<style type = "text/css">');
    printWindow.document.write(table_style);
    printWindow.document.write("</style>");
    printWindow.document.write("</head>");

    //Print the DIV contents i.e. the HTML Table.
    printWindow.document.write("<body>");
    var divContents = document.getElementById("export-grid").innerHTML;
    printWindow.document.write(divContents);
    printWindow.document.write("</body>");

    printWindow.document.write("</html>");
    printWindow.document.close();
    printWindow.print();
  }

  updateRow(rowIndex: number) {
    this.submitEmitter(this.rows[rowIndex]);
    // this.callServerMethod(
    //   this.config.editSettingsRequest.add,
    //   this.rows[rowIndex]
    // );
    // console.log(this.rows[rowIndex]);
    // this.config.editSettingsRequest.add.type = "POST";
    // this._service
    //   .callServerMethod(
    //     this.config.editSettingsRequest.add,
    //     this.rows[rowIndex],
    //     this._activateRouter
    //   )
    //   .subscribe((data: any) => {
    //     if (data) {
    //     }
    //   });
  }

  onChangeDropdownFilterOptions(event: string) {
    this.selectedDropdownFilter = event;
    this._storageService.setDropdownFilterOptionForGrid(
      window.location.pathname,
      this.selectedDropdownFilter
    );
    if (event === "Bezirksverwaltung") {
      this.resetFbzFilter();
    } else if (event === "FBZ") {
      this.resetRegionFilter();
    } else {
      this.resetFbzFilter();
      this.resetRegionFilter();
    }
    this.filterData();
  }

  onChangeRegion(event: any, checkOtherParameters = true, rows?: any) {
    if (event) {
      this.searchRegionValue = event;
    } else {
      this.searchRegionValue = {
        id: null,
        name: null,
      };
    }

    this._storageService.setRegionFilterForGrid(
      window.location.pathname,
      this.searchRegionValue
    );
    this.filterData();
  }

  resetRegionFilter() {
    this.searchRegionValue = {
      id: null,
      name: null,
    };
    this._storageService.setRegionFilterForGrid(
      window.location.pathname,
      this.searchRegionValue
    );
  }

  onChangeFbz(event: any, checkOtherParameters = true, rows?: any) {
    if (event) {
      this.searchFbzValue = event;
    } else {
      this.searchFbzValue = {
        id: null,
        name: null,
      };
    }

    this._storageService.setFbzFilterForGrid(
      window.location.pathname,
      this.searchFbzValue
    );
    this.filterData();
  }

  onChangeTraingValid(event: any) {
    this._storageService.setTrainingValidForGrid(
      window.location.pathname,
      this.searchTrainingValidValue
    );
    this.filterData();
  }

  onChangeTraingValidDate(event: any) {
    if (event && !event.value) {
      this.searchTrainingValidDate = new Date();
    } else {
      this.searchTrainingValidDate = event.value;
    }
    this._storageService.setTrainingValidDateForGrid(
      window.location.pathname,
      this.searchTrainingValidDate
    );
    setTimeout(() => {
      this.filterData();
    }, 100);
  }

  onChangeValidCard(event: any) {
    this._storageService.setValidCardForGrid(
      window.location.pathname,
      this.searchValidCardValue
    );
    this.filterData();
  }

  onChangeWholeArea(event: any) {
    this._storageService.setWholeAreaForGrid(
      window.location.pathname,
      this.searchWholeArea
    );
    this.filterData();
  }

  resetFbzFilter() {
    this.searchFbzValue = {
      id: null,
      name: null,
    };
    this._storageService.setFbzFilterForGrid(
      window.location.pathname,
      this.searchFbzValue
    );
  }

  filterData() {
    let temp = this.tempData;

    if (this.config.regionFilter) {
      this.loaderContent = true;
      this._service
        .callGetMethod(
          "api/admin/filterFsdOrgan?bh=" +
            this.searchRegionValue.name +
            "&fbz=" +
            this.searchFbzValue.name +
            "&training=" +
            this.searchTrainingValidValue.id +
            "&date=" +
            (this.searchTrainingValidDate
              ? this.searchTrainingValidDate
              : new Date().toDateString()) +
            "&validCard=" +
            this.searchValidCardValue.id +
            "&wholeArea=" +
            this.searchWholeArea
        )
        .subscribe((data: any) => {
          temp = data;

          // Filter Our Data
          if (this.searchValue) {
            let tempFilter = [];
            const value = this.searchValue;
            temp = temp.filter(function (d) {
              if (
                Object.entries(d).filter(([k]) => {
                  return (
                    d[k] &&
                    d[k]
                      .toString()
                      .toLowerCase()
                      .indexOf(value.toLowerCase()) !== -1
                  );
                }).length
              ) {
                tempFilter.push(d);
              }
            });

            temp = tempFilter;
          }

          this.rows = this.sortByLastname(temp);
          this.loader = false;
          this.loaderContent = false;
        });
    } else {
      let tempFilter = [];
      const value = this.searchValue;
      temp = temp.filter(function (d) {
        if (
          Object.entries(d).filter(([k]) => {
            return (
              d[k] &&
              d[k].toString().toLowerCase().indexOf(value.toLowerCase()) !== -1
            );
          }).length
        ) {
          tempFilter.push(d);
        }
      });

      temp = tempFilter;
      this.rows = temp;
    }

    // Update The Rows
  }

  sortByLastname(data) {
    const sortedData = data.sort((a, b) => {
      return a.nachname.localeCompare(b.nachname);
    });
    return sortedData;
  }

  exportBirthdayAndFortbildung() {
    this.loaderContent = true;
    this._service
      .callPostMethod("/api/admin/exportBirthdayAndFortbildung", this.rows)
      .subscribe((data) => {
        this.loaderContent = false;
        this.downloadFile(data, "Geburtstag und Fortbildung");
      });
  }

  exportAllPersonalInformationAndFortbildungen() {
    this.loaderContent = true;
    this._service
      .callPostMethod(
        "/api/admin/exportAllPersonalInformationAndFortbildungen",
        this.rows
      )
      .subscribe((data) => {
        this.loaderContent = false;
        this.downloadFile(
          data,
          "Alle persönlichen Informationen und Fortbildungen"
        );
      });
  }

  exportAllPersonalInformationAndFortbildungenAndBestellungen() {
    this.loaderContent = true;
    this._service
      .callPostMethod(
        "/api/admin/exportAllPersonalInformationAndFortbildungenAndBestellungen",
        this.rows
      )
      .subscribe((data) => {
        this.loaderContent = false;
        this.downloadFile(
          data,
          "Alle persönlichen Informationen, Fortbildungen und Bestellungen"
        );
      });
  }

  downloadFile(data: any, fileName?: string) {
    const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    );
    csv.unshift(header.join(","));
    let csvArray = csv.join("\r\n");

    var link = window.document.createElement("a");
    link.setAttribute(
      "href",
      "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvArray)
    );
    link.setAttribute("download", fileName ?? "myFile.csv");
    link.click();

    // var blob = new Blob([csvArray], { type: "text/csv" });
    // saveAs(blob, fileName ?? "myFile.csv");
  }

  getNumberOfEnableAdditionalFilter() {
    let count = 0;
    if (this.searchTrainingValidValue.id != null) {
      count++;
    }
    if (this.searchValidCardValue.id != null) {
      count++;
    }

    return count;
  }
}
