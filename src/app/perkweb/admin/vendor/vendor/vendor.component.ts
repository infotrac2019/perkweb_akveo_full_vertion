import { Component, OnInit, OnDestroy, TemplateRef } from "@angular/core";

import { APIEndPoints } from "../../../services/API-end-points";
import { HttpRequestService } from "../../../services/http-request.service";

import { LocalDataSource } from "ng2-smart-table";
import { SmartTableData } from "../../../../@core/data/smart-table";
import { ResponseDto } from "../../../model/response-dto";
import { Router } from "@angular/router";
import { NbDialogService } from "@nebular/theme";
import { Vendor } from "../../../model/vendor.model";
import { ShowcaseDialogComponent } from "../../themeComponent/showcase-dialog/showcase-dialog.component";
@Component({
  selector: "ngx-vendor",
  templateUrl: "./vendor.component.html",
  styleUrls: ["./vendor.component.scss"],
})
export class VendorComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();

  data: Vendor[] = [];
  message: string;
  responseData: ResponseDto<Vendor> = null;
  error = null;
  deleteConfirm: boolean = false;

  constructor(
    private service: SmartTableData,
    private _httpService: HttpRequestService,
    private router: Router,
    private dialogService: NbDialogService
  ) {}

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
      vendorName: {
        title: "Vendor Name",
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
      contactPerson: {
        title: "Contact Person",
        type: "string",
      },
      contactNumber: {
        title: "Contact Number",
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
    this.getVendors();
  }

  getVendors() {
    this._httpService
      .getData(APIEndPoints.fetchVendorListUrl, false)
      .subscribe((vendorList: any) => {
        this.data = vendorList.dataItems;
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
            .deleteData(APIEndPoints.deleteVendorUrl, event.data.id, true)
            .subscribe(
              (data: ResponseDto<any>) => {
                this.responseData = data;
                this.source.remove(event.data);
              },
              (error) => {
                this.error = error;
              }
            );
        }
      });
  }

  onEditConfirm(event) {
    console.log(event);
    this.router.navigate(["admin/vendor/edit", event.data.id]);
  }
}
