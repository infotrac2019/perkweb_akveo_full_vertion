import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Offer } from '../../../model/offer.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Group } from '../../../model/group.model';
import { OfferClaimDetails } from '../../../model/offer-claim-details';
import { HttpRequestService } from '../../../services/http-request.service';
import { APIEndPoints } from '../../../services/API-end-points';
import { Vendor } from '../../../model/vendor.model';
import { map } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { EntityPopupComponent } from '../../themeComponent/entity-popup/entity-popup.component';
import { Company } from '../../../model/company.model';
import { OfferCategory } from '../../../model/offer-category';
import { ResponseDto } from '../../../model/response-dto';
import { OfferImage } from '../../../model/offer-image';
import * as moment from "moment";
import { ShowcaseDialogComponent } from '../../themeComponent/showcase-dialog/showcase-dialog.component';

@Component({
  selector: 'ngx-add-offer',
  templateUrl: './add-offer.component.html',
  styleUrls: ['./add-offer.component.scss']
})
export class AddOfferComponent implements OnInit {

  offerForm: FormGroup;
  offer: Offer = new Offer();
  group: Group = new Group();
  image: OfferImage = new OfferImage();
  claimDetails: OfferClaimDetails = new OfferClaimDetails;
  vendorList: Vendor[];
  companyList: Company[];
  categoryList: OfferCategory[];
  imageList: OfferImage[];

  selectedCompanyList: Company[] = [];
  selectedCategoryList: OfferCategory[] = [];

  filteredOptions$: Observable<any[]>;
  options: any[];

  params: Params;
  isEdit: boolean = false;
  submitted: boolean = false;
  saveAsDraft: boolean = false;
  catChecked: boolean = false;
  disableOfferCheckbox: boolean = true;

  @ViewChild("vendorInput") input;

  selectedType;
  selectedGroup;
  imageSrc: string = "https://www.gogetorganised.co.uk/wp-content/uploads/2016/09/upload1.jpg";

  constructor(
    private router: Router,
    private _httpService: HttpRequestService,
    private dialogService: NbDialogService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder

  ) { }

  formControls(control: string) { return this.offerForm.get(control); }

  async ngOnInit(): Promise<void> {


    this.offerForm = this.formBuilder.group({
      id: [null],
      offerName: [null, Validators.required],
      offerType: [null, Validators.required],
      code: [null, Validators.required],
      url: [null],
      snippet: [null, Validators.required],
      redemptionUrl: [null, Validators.required],
      offerStartDate: [null, Validators.required],
      offerEndDate: [null, Validators.required],
      disabled: [false],
      group: this.formBuilder.group({
        id: [1, Validators.required],
      }),
      vendor: [null, Validators.required],
      companies: this.formBuilder.array([]),
      categories: this.formBuilder.array([]),
      image: this.formBuilder.array([
        [null, Validators.required]
      ]),
      claimDetails: this.formBuilder.group({
        offerDetails: [null, Validators.required],
        howToRedeem: [null, Validators.required],
        faqs: [null, Validators.required],
        termsAndConditions: [null, Validators.required],

      }),
    });

    this.offer.group = this.group;
    this.offer.claimDetails = this.claimDetails;
    this.offer.image = this.imageList;

    this.getAllVendors();
    this.getAllCompanies();
    await this.getAllCategory();

    console.log(this.offerForm);

    this.activatedRoute.params.subscribe((params) => {
      this.params = params;
      if (params["id"]) {
        this.isEdit = true;
        this.findOfferById(params["id"]);
      } else {
        this.isEdit = false;
      }
    });
  }

  findOfferById(id: string) {
    this._httpService
      .getData(APIEndPoints.getOfferByIdUrl + id, false)
      .subscribe((responseData: ResponseDto<Offer>) => {
        this.offer = responseData.data;
        if (!responseData.data.group) {
          this.offer.group = this.group;
        }
        console.log("from findCompanyById : ");
        console.log(responseData.data);

        if(responseData.data.offerStatus=='DRAFT'){
          this.disableOfferCheckbox = true
        }else{
          this.disableOfferCheckbox = false

        }
        this.offerForm.patchValue({
          offerName: this.offer.offerName,
          offerType: this.offer.offerType,
          code: this.offer.code,
          url: this.offer.url,
          snippet: this.offer.snippet,
          redemptionUrl: this.offer.redemptionUrl,
          offerStartDate: this.convertDatetoMoment(this.offer.offerStartDate),
          offerEndDate: this.convertDatetoMoment(this.offer.offerEndDate),
          offerStatus: this.offer.offerStatus,
          disabled: this.offer.disabled,
          group: {
            id: this.offer.group.id
          },
          categories: this.offer.categories,
          companies: this.offer.companies,
          vendor: this.offer.vendor,
          claimDetails: this.offer.claimDetails,
          image: this.offer.image
        });

        this.selectedCompanyList = this.offer.companies;
        this.selectedType = this.offer.offerType;
        const checkArray: FormArray = this.formControls('categories') as FormArray;

        this.categoryList.forEach(category => {
                    
          if(category.category==null){
            if (this.offer.categories.some(cat => { return cat.id == category.id })) {
                category.isChecked = true;

                const catSelected: OfferCategory = new OfferCategory();
                catSelected.id = category.id;
                catSelected.isChecked = true;
                checkArray.push(new FormControl(catSelected));
              }

                category.subCategory.forEach(subCat => {
                  if (this.offer.categories.some(cat => { return cat.id == subCat.id })) {
                    subCat.isChecked = true;

                    const catSelected: OfferCategory = new OfferCategory();
                    catSelected.id = subCat.id;
                    catSelected.isChecked = true;
                    checkArray.push(new FormControl(catSelected));
                  }

                });
          }
        });

        // this.categoryList.forEach(category => {
        //   if (this.offer.categories.some(cat => { return cat.id == category.id })) {
        //     category.isChecked = true;
        //     if (category.subCategory) {
        //       category.subCategory.forEach(subCat => {
        //         subCat.isChecked = true;
        //       })
        //     }
        //     const catSelected: OfferCategory = new OfferCategory();
        //     catSelected.id = category.id;
        //     catSelected.isChecked = true;
        //     checkArray.push(new FormControl(catSelected));
        //   }
        // });
        this.offerForm.updateValueAndValidity();
        console.log(this.offerForm);
      });
  }

  publishOffer(){

    this.submitted = true;
    console.log(this.offerForm);
    console.log(this.offerForm.value);

    const offer:Offer = this.offerForm.value;
    offer.companies = this.selectedCompanyList.map(company => { return { id: company.id } });
    offer.vendor = {id:offer.vendor.id};
    if(offer.disabled){
      offer.offerStatus = "DISABLED";
    }else{
      offer.offerStatus = "ACTIVE";
    }
    
    offer.image = null;
    console.log(offer);

    this.addOrUpdateOffer(offer);
  
  }
  addOrUpdateOffer(offer: Offer) {

    if (this.isEdit) {
      this._httpService
        .putData(APIEndPoints.editOfferUrl + this.params.id, offer, true)
        .subscribe((data: ResponseDto<any>) => {
          console.log(data);
          this.router.navigate(["/admin/offer"]);
        });
    } else {
      this._httpService
        .postData(APIEndPoints.addOfferUrl, offer, true)
        .subscribe((data: ResponseDto<any>) => {
          console.log(data);
          this.router.navigate(["/admin/offer"]);
        });
    }

  }
  onClickCancel() {
    this.submitted = false;
    this.router.navigate(["/admin/offer"]);
  }

  onSaveAsDraft() {
    console.log("saveAsDraft...");
    this.submitted = false;
    this.saveAsDraft = true;

    if(this.formControls('offerName').invalid
    || this.formControls('group').invalid
    || this.formControls('vendor').invalid){
      return;
    }
    const form = this.offerForm.value;
    console.log(this.offerForm);
    this.offer = form;
    this.offer.offerStatus = "DRAFT";
    if (form.group.id == null) {
      this.offer.group = null;
    }
    if (form.vendor) {
      let vendor = new Vendor();
      vendor.id = form.vendor.id;
      this.offer.vendor = vendor;
    }

    this.offer.companies = this.selectedCompanyList.map(company => { return { id: company.id } });
    if (form.image && form.image.length) {
      const image: OfferImage = new OfferImage();
      image.fileLocation = form.image[0];
      image.id = null;
      this.offer.image[0] = image;
    } else {
      this.offer.image = null;
    }
    this.offer.image = null;
    console.log(this.offer);

    this.addOrUpdateOffer(this.offer);

  }

  onFileChange(event) {
    const reader = new FileReader();
    console.log(event);
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      console.log(file);

      reader.onload = () => {

        this.imageSrc = reader.result as string;
        this.image.fileLocation = file.name;
        this.image.id = null;

        // const imgArray: FormArray = this.formControls('image') as FormArray;
        // imgArray.controls[0].setValue(this.image);
        console.log(this.formControls('image'));
        window.localStorage.setItem('filestore', reader.result as string);
        console.log(window.localStorage);
      };

    }
  }


  onVendorSelectnChange($event) {
    this.filteredOptions$ = this.getFilteredOptions($event.vendorName, "vendorName");

  }

  getFilteredOptions(value: string, filterColumn: string): Observable<any[]> {
    return of(value).pipe(map((filterString) => this.filter(filterString, filterColumn)));
  }

  onChange(from: string) {
    this.filteredOptions$ = this.getFilteredOptions(
      this.input.nativeElement.value, "vendorName"
    );
  }

  private filter(value: string, filterColumn: string): any[] {

    const filterValue = value.toLowerCase();

    return this.options.filter((optionValue) =>
      optionValue[filterColumn].toLowerCase().includes(filterValue)
    );
  }

  viewHandle(value) {
    return (value.vendorName == undefined) ? value : value.vendorName;
  }

  getAllVendors() {
    this._httpService
      .getData(APIEndPoints.fetchVendorListUrl, false)
      .subscribe((vendorList: any) => {
        this.vendorList = vendorList.dataItems;
        this.options = vendorList.dataItems;
        this.filteredOptions$ = of(vendorList.dataItems);
      });
  }

  getAllCompanies() {
    this._httpService
      .getData(APIEndPoints.fetchCompanyListUrl, false)
      .subscribe((companyList: any) => {
        this.companyList = companyList.dataItems;
      });
  }

  getAllCategory() {
    this._httpService
      .getData(APIEndPoints.fetchCategoryListUrl, false)
      .subscribe((categoryList: any) => {
        this.categoryList = categoryList.dataItems;
        console.log(categoryList.dataItems);
        return categoryList.dataItems;
      });

  }
  checkChildCategory(categorySelected: OfferCategory) {

    this.categoryList.forEach(category => {
      if (category.category == null && category.id == categorySelected.id) {
        category.isChecked = true;
        return category;
      }
    })
  }
  uncheckChildCategory(categorySelected: OfferCategory) {

    this.categoryList.forEach(category => {
      if (category.category == null && category.id == categorySelected.id) {
        category.isChecked = false;
        return category;
      }
    })
  }
  onCheckboxChange(e, category: OfferCategory) {

    console.log(category);

    const checkArray: FormArray = this.formControls('categories') as FormArray;
    const categorySelected: OfferCategory = new OfferCategory();
    categorySelected.id = category.id;
    var contains: boolean = false;


    if ((e && e.target.checked) || (e == null && category.isChecked)) {
      checkArray.push(new FormControl(categorySelected));
      category.isChecked = true;

      if (e == null) { return; }
      //parent checked
      if (category.subCategory && category.subCategory.length > 0) {
        category.subCategory.forEach(subCat => {
          if (!subCat.isChecked) {
            subCat.isChecked = true;
            this.onCheckboxChange(null, subCat);
          }

        });
        console.log(checkArray.value);
        return;
      }
      //child is checked
      else {
        if ((category.category != null)) {
          var list = (this.categoryList.filter(cat => {
            if (cat.id == category.category.id) {
              return cat;
            }
          }));

          const parentCategory = list[0];
          if (parentCategory.subCategory.every(cat => { return cat.isChecked })) {
            parentCategory.isChecked = true;
            const cat: OfferCategory = new OfferCategory();
            cat.id = parentCategory.id;
            checkArray.push(new FormControl(cat));
          }

        }
      }
      console.log(checkArray);
    } else {

      //remove selected
      this.removeFromCheckArray(category, checkArray);

      //if parent selected
      if (category.category == null) {
        category.subCategory.forEach(subCat => {
          subCat.isChecked = false;
          this.removeFromCheckArray(subCat, checkArray);
        });

        // if child selected
      } else {
        var list = (this.categoryList.filter(cat => {
          if (cat.id == category.category.id) {
            return cat;
          }
        }));
        console.log(list);
        const parentCategory = list[0];
        if (parentCategory.subCategory.some(cat => { return cat.isChecked == false })) {
          parentCategory.isChecked = false;
          this.removeFromCheckArray(parentCategory, checkArray);

        }
      }
    }

    console.log(this.formControls('categories').value);
  }

  removeFromCheckArray(category: OfferCategory, checkArray: FormArray) {
    let i: number = 0;
    category.isChecked = false;
    checkArray.controls.forEach((item: FormControl) => {
      if (item.value.id == category.id) {
        checkArray.removeAt(i);
        return;
      }
      i++;
    });
  }
  onClickCompany() {
    console.log(this.companyList);
    console.log(this.selectedCompanyList);

    this.dialogService.open(EntityPopupComponent, {
      context: {
        title: "Company",
        data: this.companyList,
        preSelectCriteria: this.selectedCompanyList,
        columns: {
          companyName: {
            title: "Company Name",
            type: "string",
          },
          country: {
            title: "Country",
            valuePrepareFunction: (cell, row) => {
              return row.address.country;
            }

          },
          city: {
            title: "City",
            valuePrepareFunction: (cell, row) => {
              return row.address.city;
            }
          }
        }
      },
    }).onClose.subscribe(selectedList => {
      if (selectedList) {
        selectedList.forEach(element => {
          this.selectedCompanyList.push(element);
        });
      }
    });
  }

  onDeleteFromCompanyList(obj: any) {
    this.selectedCompanyList = this.selectedCompanyList.filter(
      (company) => obj.id != company.id
    );
  }

  onClickCategory() {
    this.dialogService.open(EntityPopupComponent, {
      context: {
        title: "Category",
        data: this.categoryList,
        preSelectCriteria: this.selectedCategoryList,
        columns: {
          id: {
            title: "Id",
            type: "string",
          },
          name: {
            title: "Offer Category Name",
            type: "string",
          }

        }
      },
    }).onClose.subscribe(selectedList => {
      if (selectedList) {
        this.selectedCategoryList = selectedList;
      }
    });
  }
  onDeleteFromCategoryList(obj: any) {
    this.selectedCategoryList = this.selectedCategoryList.filter(
      (category) => obj.id != category.id
    );
  }

  convertDatetoMoment(date: string) {
    return moment(date, "DD-MM-YYYY");
  }
  
}