import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { NgForm } from "@angular/forms";
import { APIEndPoints } from "../../services/API-end-points";
import { Router, ActivatedRoute } from "@angular/router";
import { ResponseDto } from "../../model/response-dto";
import { Observable, of } from "rxjs";
import { HttpRequestService } from "../../services/http-request.service";
import { map } from "rxjs/operators";
import { LocalDataSource } from "ng2-smart-table";
import { Company } from '../../model/company.model';
import { Address } from '../../model/address.model';

@Component({
  selector: "ngx-add-company",
  templateUrl: "./add-company.component.html",
  styleUrls: ["./add-company.component.scss"],
})
export class AddCompanyComponent implements OnInit {
  responseData: ResponseDto<any> = null;
  params;
  isEdit: boolean = false;
  vendorData: any[] = [];
  blacklistedVendors: any[] = [];
  options: any[];
  companyOptions: any[];
  filteredOptions$: Observable<any[]>;
  companyFilteredOptions$: Observable<any[]>;
  isBlackListed:boolean;

  @ViewChild("autoInputVendor") input;
  @ViewChild("autoInputCorp") inputCorp;

  source: LocalDataSource = new LocalDataSource();
  address = new Address();
  data:Company = new Company();
  corporation:Company = new Company();
  companyListForParentSelectn: Company[] = [];

  settings = {
    mode: "external",
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      position: "right",
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
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
      // ownerName: {
      //   title: "Owner Name",
      //   type: "string",
      // },
      // ownerEmail: {
      //   title: "Owner Email",
      //   type: "string",
      // },
      // contactPerson: {
      //   title: "Contact Person",
      //   type: "string",
      // },
      // contactNumber: {
      //   title: "Contact Number",
      //   type: "string",
      // },
      // creationDate: {
      //   title: "Created At",
      //   type: "Date",
      // },
      // updationDate: {
      //   title: "Updated At",
      //   type: "Date",
      // },
    },
  };

  constructor(
    private _httpService: HttpRequestService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  
    ) {}

  ngOnInit(): void {
    
    this.data.address=this.address;
    // this.data.corporation=this.corporation;
    console.log("DATA");
    console.log(this.data);
    this.activatedRoute.params.subscribe((params) => {
      this.params = params;
      if (params["id"]) {
        this.isEdit = true;
        this.findCompanyById(params["id"]);
      } else {
        this.isEdit = false;
      }
    });

    if (this.isEdit) {
      this.getCompaniesForParentSelection(this.params["id"]);
      this.getAllVendors();
    }else{
      this.getCompaniesForParentSelection(0);
    }
  
  }

  addOrUpdateCompany(company: NgForm) {
    console.log(company.value);

    if(company.value.corporation && company.value.corporation.id){
          company.value.corporation = {"id": company.value.corporation.id};
    }else{
          company.value.corporation = null;
    }
    if (this.isEdit) {
      //Edit Company

      company.value.id = this.params["id"];
      company.value.blacklistedVendors = this.blacklistedVendors.map(
        (vendor) => {
          return { id: vendor.id };
        }
      );
      console.log("sent for edit company ---->>>");
      console.log(company.value);
      this._httpService
        .putData(
          APIEndPoints.editCompanyUrl + this.params["id"],
          company.value,
          true
        )
        .subscribe((data: ResponseDto<any>) => {
          console.log(data);
          this.responseData = data;
          this.router.navigate(["/admin/company"]);
        });
    } else {
      //Add New Company
      this._httpService
        .postData(APIEndPoints.createCompanyUrl, company.value, true)
        .subscribe((data: ResponseDto<any>) => {
          console.log(data);
          this.responseData = data;
          this.router.navigate(["/admin/company"]);
        });
    }
  }

  findCompanyById(id: string) {
    this._httpService
      .getData(APIEndPoints.getCompanyByIdUrl + id, false)
      .subscribe((responseData: ResponseDto<Company>) => {
        console.log(responseData);
        this.responseData = responseData;
        this.data = responseData.data;

        //set address blank if null
        if (!responseData.data.address) {
          this.data.address = this.address;
        }
        this.blacklistedVendors = responseData.data.blacklistedVendors;
        // this.source.load(responseData.data.blacklistedVendors);
        console.log("from findCompanyById : ");
        console.log(responseData);
      });
  }

  getAllVendors() {
    this._httpService
      .getData(APIEndPoints.fetchVendorListUrl, false)
      .subscribe((vendorList) => {
        console.log("getAllVendors");
        console.log(vendorList);

        this.vendorData = vendorList.dataItems;
        this.options = vendorList.dataItems;
        this.filteredOptions$ = of(this.options);
      });
  }

  getCompaniesForParentSelection(id:number){
    this._httpService
      .getData(APIEndPoints.parentCompanySelectionUrl+id, false)
      .subscribe((companyList) => {
        console.log("getCompaniesForParentSelection");
        console.log(companyList);

        this.companyListForParentSelectn = companyList.dataItems;
        this.companyOptions = companyList.dataItems;
        this.companyFilteredOptions$ = of(this.companyOptions);
      });
  }

  onClickCancel() {
    this.router.navigate(["/admin/company"]);
  }

  private filter(value: string, filterColumn:string): any[] {

    const filterValue = value.toLowerCase();

    if(filterColumn=="vendorName"){
    return this.options.filter((optionValue) =>
        optionValue[filterColumn].toLowerCase().includes(filterValue)
      );
    }
    if(filterColumn=="companyName" && this.companyOptions){
      return this.companyOptions.filter((optionValue) =>
      optionValue[filterColumn].toLowerCase().includes(filterValue)
    );
    }
       
  }

  getFilteredOptions(value: string, filterColumn:string): Observable<any[]> {
    return of(value).pipe(map((filterString) => this.filter(filterString, filterColumn)));
  }

  onChange(from:string) {

    if(from=="corporation"){
      this.companyFilteredOptions$ = this.getFilteredOptions(
        this.inputCorp.nativeElement.value, "companyName"
      );
      // this.companyFilteredOptions$.subscribe(list=>{
      //   console.log("on change $$$$$ "+list.length);
      //   if(list.length==0){
      //     this.inputCorp.nativeElement.value=""
      //   }
      // });

    }if(from=="blacklistedVendors"){
      this.filteredOptions$ = this.getFilteredOptions(
        this.input.nativeElement.value, "vendorName"
      );
      
    }
    
  }

  onSelectionChange($event) {
    console.log("...onSelectionChange...");
    console.log($event);
    console.log(this.blacklistedVendors);
    this.filteredOptions$ = this.getFilteredOptions($event.vendorName,"vendorName");

    if (!this.blacklistedVendors.some((vendor) => $event.id == vendor.id)) {
      this.blacklistedVendors.push($event);
      this.isBlackListed=false;
      // this.source.load(this.blacklistedVendors);
    } else {
      this.isBlackListed=true
      alert("Already black listed");
    }
    this.input.nativeElement.value=""
  }

  onDeleteConfirm($event) {
    // this.source.remove($event.data);
    this.blacklistedVendors = this.blacklistedVendors.filter(
      (vendor) => $event.id != vendor.id
    );
  }

  onParentCompanySelectnChange($event) {
    console.log("...onParentCompanySelectnChange...");
    console.log($event);
    this.companyFilteredOptions$ = this.getFilteredOptions($event.companyName,"companyName");

  }

  viewHandle(value) {
    return (value.vendorName==undefined)?value:value.vendorName;
  }
  viewHandleCorp(value){
    return (value.companyName==undefined)?value:value.companyName;
  }

  @HostListener('window:click', ['$event'])
  onGlobalClick(event): void {
    // clicked outside
     if (!this.inputCorp.nativeElement.contains(event.target)) {
        if(!this.companyListForParentSelectn.some((company) => company.companyName == this.inputCorp.nativeElement.value)){
          this.inputCorp.nativeElement.value = "";
        }
     }
  }

  onClose(){
    this.isBlackListed=false;
  }
 
}
