import { Component, OnInit } from "@angular/core";

import { APIEndPoints } from "../../../services/API-end-points";
import { HttpRequestService } from "../../../services/http-request.service";

import { LocalDataSource } from "ng2-smart-table";
import { SmartTableData } from "../../../../@core/data/smart-table";
import { ResponseDto } from "../../../model/response-dto";
import { Router } from "@angular/router";
import { NbDialogService } from "@nebular/theme";
import { User } from "../../../model/user.model";
import { ShowcaseDialogComponent } from "../../themeComponent/showcase-dialog/showcase-dialog.component";

@Component({
  selector: "ngx-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();

  data: User[] = [];
  message: string;
  responseData: ResponseDto<User> = null;
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
      firstName: {
        title: "First Name",
        type: "string",
      },

      lastName: {
        title: "Last Name",
        type: "string",
      },
      company: {
        title: "Company",
        valuePrepareFunction: (cell, row) => {
          return row.company.companyName;
        },
      },
      userType: {
        title: "User Type",
        type: "string",
      },
      group: {
        title: "User Group",
        valuePrepareFunction: (cell, row) => {
          return row.group.name;
        },
      },
      contactNumber: {
        title: "Contact Number",
        type: "string",
      },
      employeeId: {
        title: "Employee Id",
        valuePrepareFunction: (cell, row) => {
          return row.employeeDetails ? row.employeeDetails.employeeId : "";
        },
      },
      primaryEmployee: {
        title: "Primary Employee",
        valuePrepareFunction: (cell, row) => {
          return row.primaryUser ? row.primaryUser.employeeId : "";
        },
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
    this.getUsers();
  }

  getUsers() {
    this._httpService
      .getData(APIEndPoints.fetchUserListUrl, false)
      .subscribe((userList: any) => {
        this.data = userList.dataItems;
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
            .deleteData(APIEndPoints.deleteUserUrl, event.data.id, true)
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
    this.router.navigate(["admin/user/edit", event.data.id]);
  }
}
