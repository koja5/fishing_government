import { Component } from "@angular/core";
import { CallApiService } from "app/services/call-api.service";
import { FortbildungstermineModel } from "../../models/fortbildungstermine-model";
import { ActivatedRoute } from "@angular/router";
import { HelpService } from "app/services/help.service";
import { FsdOrganModel } from "../../models/fsd-organ-model";
import { BestellungenModel } from "../../models/bestellungen-model";
import { JahresfischerkartenModel } from "../../models/jahresfischerkarten-model";

@Component({
  selector: "app-fsd-organ-details",
  templateUrl: "./fsd-organ-details.component.html",
  styleUrls: ["./fsd-organ-details.component.scss"],
})
export class FsdOrganDetailsComponent {
  public path = "grids/admin";
  public file = "all-bestellungen.json";

  public pathForJahresfischerkarten = "grids/admin";
  public fileForJahresfischerkarten = "all-jahresfischerkarten.json";

  public fortbildungstermine = new FortbildungstermineModel();
  public fsdOrgan = new FsdOrganModel();
  public allBestellungen: BestellungenModel[];
  public allJahresfischerkarten: JahresfischerkartenModel[];
  public loader = true;

  constructor(
    private _service: CallApiService,
    private _activatedRouter: ActivatedRoute,
    public _helpService: HelpService
  ) {}

  ngOnInit() {
    this.getFortbildungstermine();
    this.getFsdOrgan();
    this.getAllBestellungen();
    this.getAllJahresfischerkarten();
  }

  getFsdOrgan() {
    this.loader = true;
    this._service
      .callGetMethod(
        "/api/admin/getFsdOrgan",
        this._activatedRouter.snapshot.queryParams.fsd_id
      )
      .subscribe((data: FsdOrganModel) => {
        this.fsdOrgan = data;
        this.loader = false;
      });
  }

  getFortbildungstermine() {
    this.loader = true;
    this._service
      .callGetMethod(
        "/api/admin/getFortbildungstermine",
        this._activatedRouter.snapshot.queryParams.fsd_id
      )
      .subscribe((data: FortbildungstermineModel) => {
        this.fortbildungstermine = data;
        this.loader = false;
      });
  }

  getAllBestellungen() {
    this._service
      .callGetMethod(
        "/api/admin/getAllBestellungen",
        this._activatedRouter.snapshot.queryParams.fsd_id
      )
      .subscribe((data: BestellungenModel[]) => {
        this.allBestellungen = data;
      });
  }

  getAllJahresfischerkarten() {
    this._service
      .callGetMethod(
        "api/admin/getAllJahresfischerkarten",
        this._activatedRouter.snapshot.queryParams.fsd_id
      )
      .subscribe((data: JahresfischerkartenModel[]) => {
        this.allJahresfischerkarten = data;
      });
  }
}
