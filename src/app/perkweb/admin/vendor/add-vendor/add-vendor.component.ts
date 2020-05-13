import { Image } from "./../../../model/image.model";
import { Vendor } from "./../../../model/vendor.model";
import { Address } from "../../../model/address.model";
import { ResponseDto } from "./../../../model/response-dto";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpRequestService } from "../../../services/http-request.service";
import { APIEndPoints } from "../../../services/API-end-points";
import { NgForm } from "@angular/forms";
import { ImageUploadComponent } from "../../themeComponent/image-upload/image-upload.component";
import { NbDialogService } from "@nebular/theme";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";

@Component({
  selector: "ngx-add-vendor",
  templateUrl: "./add-vendor.component.html",
  styleUrls: ["./add-vendor.component.scss"],
})
export class AddVendorComponent implements OnInit {
  isEdit: boolean = false;
  vendor: Vendor = new Vendor();
  address: Address = new Address();
  logoImage: any;
  submitted: boolean = false;

  vendorForm: FormGroup;

  vendorId = null;
  constructor(
    private _httpService: HttpRequestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: NbDialogService,
    private formBuilder: FormBuilder
  ) {
    this.vendor.address = this.address;
    this.activatedRoute.params.subscribe((params) => {
      if (params["id"]) {
        this.isEdit = true;
        this.vendorId = params["id"];
        this.getVendorDetails(params["id"]);
      } else {
        this.isEdit = false;
      }
    });
  }

  ngOnInit() {
    this.vendorForm = this.formBuilder.group({
      id: [null],
      vendorName: ["", Validators.required],
      ownerName: ["", Validators.required],
      ownerEmail: ["", Validators.required],
      contactPerson: ["", Validators.required],
      contactNumber: ["", Validators.required],
      unlockPin: [""],
      logoImage: this.formBuilder.group({
        id: [],
        imageExtn: [],
        imageContent: [],
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
  }

  getVendorDetails(id: number) {
    this._httpService
      .getData(APIEndPoints.getVendorByIdUrl + id, false)
      .subscribe((responseData: ResponseDto<Vendor>) => {
        this.vendor = responseData.data;

        this.vendorForm.patchValue({
          id: this.vendor.id,
          vendorName: this.vendor.vendorName,
          ownerName: this.vendor.ownerName,
          ownerEmail: this.vendor.ownerEmail,
          contactPerson: this.vendor.contactPerson,
          contactNumber: this.vendor.contactNumber,
          unlockPin: this.vendor.unlockPin,
          address: this.vendor.address || {},
          logoImage: this.vendor.logoImage || {},
        });
        if (this.vendor.logoImage)
          this.logoImage = this.encodeImage(this.vendor.logoImage);
      });
  }

  addOrUpdateVendor() {
    this.submitted = true;
    if (this.vendorForm.valid) {
      if (this.isEdit) {
        this._httpService
          .putData(
            APIEndPoints.createVendorUrl + this.vendorId,
            this.vendorForm.value,
            true
          )
          .subscribe((data: ResponseDto<any>) => {
            this.router.navigate(["/admin/vendor"]);
          });
      } else {
        this._httpService
          .postData(APIEndPoints.createVendorUrl, this.vendorForm.value, true)
          .subscribe((data: ResponseDto<any>) => {
            this.router.navigate(["/admin/vendor"]);
          });
      }
    }
  }

  onClickCancel() {
    this.router.navigate(["/admin/vendor"]);
  }

  openImageSelector() {
    this.dialogService
      .open(ImageUploadComponent, {
        context: {
          title: "Logo Image",
          aspectRatio: 1 / 1,
          imgDisplayClass: "displayLogoContainer",
        },
      })
      .onClose.subscribe((selectedImage: Image) => {
        if (selectedImage) {
          this.logoImage = selectedImage.imageContent;

          this.getFormControl("logoImage.imageExtn").setValue(
            selectedImage.imageType
          );
          this.getFormControl("logoImage.imageContent").setValue(
            selectedImage.imageContent
          );
        }
      });
  }

  removeLogo() {
    this.logoImage = null;
    this.getFormControl("logoImage").reset();
  }

  getFormControl(controlId: string) {
    return this.vendorForm.get(controlId);
  }

  encodeImage(image: Image) {
    if (image != null) {
      return "data:" + image.imageExtn + ";base64," + image.imageContent;
    }
  }
}
