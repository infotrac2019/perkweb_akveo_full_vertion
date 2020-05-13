import { EmployeeDetails } from "./../../../model/employee-details.model";
import { ListItem } from "../../../model/list-item.model";
import { User } from "./../../../model/user.model";
import { Address } from "../../../model/address.model";
import { ResponseDto } from "./../../../model/response-dto";
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpRequestService } from "../../../services/http-request.service";
import { APIEndPoints } from "../../../services/API-end-points";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { EntityPopupComponent } from "../../themeComponent/entity-popup/entity-popup.component";
import { NbDialogService } from "@nebular/theme";
import * as moment from "moment";
import { SmartTableRadioComponent } from "../../../../lib/smart-table-radio/smart-table-radio.component";

@Component({
  selector: "ngx-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.scss"],
})
export class AddUserComponent implements OnInit, AfterViewInit {
  isEdit: boolean = false;
  user: User = new User();
  address: Address = new Address();
  userForm: FormGroup;
  submitted: boolean = false;
  companies: ListItem[] = [];
  departments: ListItem[] = [];
  designations: ListItem[] = [];
  employees: EmployeeDetails[] = [];
  formInvalid: boolean = false;

  filteredCompanyOptions: Observable<ListItem[]>;
  filteredDepartmentOptions: Observable<ListItem[]>;
  filteredDesignationOptions: Observable<ListItem[]>;

  userId = null;
  constructor(
    private _httpService: HttpRequestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService
  ) {
    this.user.address = this.address;
    this.activatedRoute.params.subscribe((params) => {
      if (params["id"]) {
        this.isEdit = true;
        this.userId = params["id"];
      } else {
        this.isEdit = false;
      }
    });
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      id: [null],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: ["", Validators.required],
      gender: [, Validators.required],
      dateOfBirth: [""],
      contactNumber: ["", Validators.required],
      userType: ["PRIMARY_USER", Validators.required],
      primaryUser: this.formBuilder.group({
        id: [null],
        employeeId: [""],
      }),
      group: this.formBuilder.group({
        id: [1, Validators.required],
      }),
      company: this.formBuilder.group({
        id: [null, Validators.required],
        companyName: [""],
      }),
      employeeDetails: this.formBuilder.group({
        id: [null],
        employeeId: ["", Validators.required],
        joiningDate: ["", Validators.required],
        nationality: [""],
        compAdmin: [false],
        corporationAdmin: [false],
        designation: this.formBuilder.group({
          id: [null],
          name: [""],
        }),
        department: this.formBuilder.group({
          id: [null],
          name: [""],
        }),
        officeAddress: this.formBuilder.group({
          address_line1: [""],
          address_line2: [""],
          city: [""],
          state: [""],
          country: [""],
          zipcode: [""],
        }),
      }),
      address: this.formBuilder.group({
        address_line1: [""],
        address_line2: [""],
        city: [""],
        state: [""],
        country: [""],
        zipcode: [""],
      }),
    });

    this.getCompanies();
    this.autoCompateCompSetup();
    // this.getDepartments();
    //this.getDesignations();
  }

  ngAfterViewInit() {
    if (this.isEdit) {
      this.getUserDetails(this.userId);
    }
  }
  getCompanies() {
    this._httpService
      .getData(APIEndPoints.getCompanyItems, false)
      .subscribe((response: any) => {
        this.companies = response.dataItems;
        this.filteredCompanyOptions = this.userForm["controls"].company[
          "controls"
        ].companyName.valueChanges.pipe(
          startWith(""),
          map((filterString: string) => {
            console.log("companyName value ", filterString);
            this.filter(filterString, this.companies);
          })
        );
      });
  }

  getDepartments(companyId) {
    this._httpService
      .getData(APIEndPoints.getDepartmentItems + companyId, false)
      .subscribe((response: any) => {
        this.departments = response.dataItems;
        this.filteredDepartmentOptions = this.userForm[
          "controls"
        ].employeeDetails["controls"].department[
          "controls"
        ].name.valueChanges.pipe(
          startWith(""),
          map((filterString: string) =>
            this.filter(filterString, this.departments)
          )
        );
      });
  }

  getDesignations(companyId) {
    this._httpService
      .getData(APIEndPoints.getDesignationItems + companyId, false)
      .subscribe((response: any) => {
        this.designations = response.dataItems;
        this.filteredDesignationOptions = this.userForm[
          "controls"
        ].employeeDetails["controls"].designation[
          "controls"
        ].name.valueChanges.pipe(
          startWith(""),
          map((filterString: string) =>
            this.filter(filterString, this.designations)
          )
        );
      });
  }

  getEmployees(companyId) {
    this._httpService
      .getData(APIEndPoints.getEmployeesUrl + companyId, false)
      .subscribe((response: any) => {
        this.employees = response.dataItems;
      });
  }

  autoCompateCompSetup() {}

  private filter(value: string, options: any[]): string[] {
    if (typeof value === "string") {
      const filterValue = value.toLowerCase();
      return options.filter((option) =>
        option.value.toLowerCase().includes(filterValue)
      );
    }
  }

  onItemSelect(parentControl: string, controlName: string, $event) {
    this.userForm.get(parentControl + "." + controlName).setValue($event.value);
    this.userForm.get(parentControl + ".id").setValue($event.id);

    if (parentControl === "company") {
      let companyId = this.userForm.get("company.id").value;
      if (companyId && (companyId != null || companyId != "")) {
        this.getEmployees(companyId);
        this.getDepartments(companyId);
        this.getDesignations(companyId);
      }
    }
  }

  userChanged($event) {
    if ($event != null && $event === "PRIMARY_USER") {
      this.getFormControls("employeeDetails.employeeId").setValidators([
        Validators.required,
      ]);
      this.getFormControls("employeeDetails.joiningDate").setValidators([
        Validators.required,
      ]);
      this.getFormControls("primaryUser.id").setValidators([]);
    } else {
      this.getFormControls("employeeDetails.employeeId").setValidators([]);
      this.getFormControls("employeeDetails.joiningDate").setValidators([]);
      this.getFormControls("primaryUser.id").setValidators([
        Validators.required,
      ]);
    }
    this.getFormControls("employeeDetails.employeeId").updateValueAndValidity();
    this.getFormControls(
      "employeeDetails.joiningDate"
    ).updateValueAndValidity();
    this.getFormControls("primaryUser.id").updateValueAndValidity();
  }

  getUserDetails(id: number) {
    this._httpService
      .getData(APIEndPoints.getUserByIdUrl + id, false)
      .subscribe((responseData: ResponseDto<User>) => {
        console.log(responseData);
        this.user = responseData.data;

        this.userForm.patchValue({
          id: this.user.id,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          dateOfBirth: this.convertDatetoMoment(this.user.dateOfBirth),
          contactNumber: this.user.contactNumber,

          userType: this.user.userType,
          gender: this.user.gender,
          primaryUser: {
            id: this.user.primaryUser ? this.user.primaryUser.id : null,
            employeeId: this.user.primaryUser
              ? this.user.primaryUser.employeeId
              : null,
          },
          group: {
            id: this.user.group.id,
          },
          company: {
            id: this.user.company.id,
            companyName: this.user.company.companyName,
          },
          address: this.user.address || {},
        });

        this.getFormControls("gender").setValue(this.user.gender);

        const employeeDetails = this.user.employeeDetails;
        if (employeeDetails != null) {
          this.userForm.patchValue({
            employeeDetails: {
              id: employeeDetails.id,
              employeeId: employeeDetails.employeeId,
              joiningDate: this.convertDatetoMoment(
                employeeDetails.joiningDate
              ),
              nationality: employeeDetails.nationality,
              compAdmin: employeeDetails.compAdmin,
              corporationAdmin: employeeDetails.corporationAdmin,
              designation: employeeDetails.designation || {},
              department: employeeDetails.department || {},
              officeAddress: employeeDetails.officeAddress || {},
            },
          });
        }
        if (this.user.company) {
          this.getDepartments(this.user.company.id);
          this.getDesignations(this.user.company.id);
          this.getEmployees(this.user.company.id);
        }
        // this.userForm.updateValueAndValidity();
        this.getFormControls("company.id").setValue(this.user.company.id);
        if (employeeDetails && employeeDetails.department != null) {
          this.getFormControls("employeeDetails.department.id").setValue(
            employeeDetails.department.id
          );
        }
        if (employeeDetails && employeeDetails.designation != null) {
          this.getFormControls("employeeDetails.designation.id").setValue(
            employeeDetails.designation.id
          );
        }
        this.userChanged(this.user.userType);
      });
  }

  updateUser() {
    this.submitted = true;
    if (this.userForm.valid) {
      let formValue = this.userForm.value;

      if (formValue.userType != "PRIMARY_USER") {
        formValue.employeeDetails = null;
      } else {
        formValue.primaryUser = null;
        if (formValue.employeeDetails.department.id == null)
          formValue.employeeDetails.department = null;
        if (formValue.employeeDetails.designation.id == null)
          formValue.employeeDetails.designation = null;
      }
      if (!this.isEdit) {
        this._httpService
          .postData(APIEndPoints.createUserUrl, formValue, true)
          .subscribe((data: ResponseDto<any>) => {
            this.router.navigate(["/admin/user"]);
          });
      } else {
        this._httpService
          .putData(APIEndPoints.createUserUrl + this.userId, formValue, true)
          .subscribe((data: ResponseDto<any>) => {
            this.router.navigate(["/admin/user"]);
          });
      }
    } else {
      this.formInvalid = true;
    }
  }
  onClickCancel() {
    this.router.navigate(["/admin/user"]);
  }

  openEmployeeSelector() {
    if (
      !this.getFormControls("company.id").value ||
      this.getFormControls("company.id").value == null ||
      this.getFormControls("company.id").value == ""
    ) {
      alert("Please select a company");
      return;
    }
    this.dialogService
      .open(EntityPopupComponent, {
        context: {
          title: "Primary Employee",
          data: this.employees,
          preSelectCriteria: [],
          settings: {
            actions: {
              add: false,
              edit: false,
              delete: false,
            },
            columns: {
              select: {
                title: "Select",
                type: "custom",
                renderComponent: SmartTableRadioComponent,
                onComponentInitFunction(instance) {
                  instance.selectRow.subscribe((row) => {
                    this.setSelectedRow(row);
                  });
                },
                filter: false,
              },

              firstName: {
                title: "First Name",
                type: "string",
              },

              lastName: {
                title: "Last Name",
                type: "string",
              },
              employeeId: {
                title: "Employee Id",
                valuePrepareFunction: (cell, row) => {
                  return row.employeeDetails.employeeId;
                },
              },
            },
          },
        },
      })
      .onClose.subscribe((selectedList) => {
        if (selectedList) {
          selectedList.forEach((element) => {
            // this.selectedCompanyList.push(element);
            console.log("selected user" + element);
            this.getFormControls("primaryUser.id").setValue(
              element.employeeDetails.id
            );
            this.getFormControls("primaryUser.employeeId").setValue(
              element.employeeDetails.employeeId
            );
          });
        }
      });
  }

  getFormControls(controlId: string) {
    return this.userForm.get(controlId);
  }
  convertDatetoMoment(date: string) {
    return moment(date, "DD-MM-YYYY");
  }
}
