import { Component, OnInit } from "@angular/core";

import { APIEndPoints } from "../../services/API-end-points";
import { HttpRequestService } from "../../services/http-request.service";

import { LocalDataSource } from "ng2-smart-table";
import { SmartTableData } from "../../../@core/data/smart-table";
import { ResponseDto } from "../../model/response-dto";
import { Router } from "@angular/router";
import { NbDialogService } from "@nebular/theme";
import { Company } from "../../model/company.model";
import { ShowcaseDialogComponent } from "../themeComponent/showcase-dialog/showcase-dialog.component";

@Component({
  selector: "ngx-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.scss"],
})
export class CompanyComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();

  data: Company[] = [];
  message: string;
  responseData: ResponseDto<any> = null;
  error = null;
  deleteConfirm: boolean = false;

  constructor(
    private service: SmartTableData,
    private _httpService: HttpRequestService,
    private router: Router,
    private dialogService: NbDialogService
  ) {
    // const data = this.service.getData();
  }

  settings = {
    mode: "external",
    actions: {
      add: false,
      position: "right",
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: "Id",
        type: "string",
      },
      companyName: {
        title: "Company Name",
        type: "string",
      },
      domainName: {
        title: "Domain",
        type: "string",
      },
      ownerName: {
        title: "Owner Name",
        type: "string",
      },
      ownerEmail: {
        title: "Owner Email",
        type: "string",
      },
      reserveAlert: {
        title: "Reserve Alert",
        type: "string",
      },
      reserveBcc: {
        title: "Reserve Bcc",
        type: "string",
      },
      activeStr: {
        title: "Status",
        type: "string",
      },
      creationDate: {
        title: "Created At",
        type: "Date",
      },
      updationDate: {
        title: "Updated At",
        type: "Date",
      },
    },
  };

  ngOnInit() {
    this.getCompanies();
  }

  getCompanies() {
    this._httpService
      .getData(APIEndPoints.fetchCompanyListUrl, false)
      .subscribe((companyList: any) => {
        this.data = companyList.dataItems;
        this.data.map((company) => {
          company.active
            ? (company.activeStr = "Enabled")
            : (company.activeStr = "Disabled");
          return company;
        });
        this.source.load(this.data);
      });
  }

  onDeleteConfirm(event) {
    this.dialogService
      .open(ShowcaseDialogComponent, {
        context: {
          title: "DELETE",
          message: " Are you sure you want to delete?",
        },
      })
      .onClose.subscribe((ok) => {
        this.deleteConfirm = ok;
        if (this.deleteConfirm) {
          console.log("deleteConfirm");
          console.log(event);

          this._httpService
            .deleteData(APIEndPoints.deleteCompanyUrl, event.data.id, true)
            .subscribe((data: ResponseDto<any>) => {
              this.responseData = data;
              this.source.remove(event.data);
            });
        }
      });
  }

  onEditConfirm(event) {
    console.log(event);
    this.router.navigate(["admin/company/edit", event.data.id]);
  }
}
