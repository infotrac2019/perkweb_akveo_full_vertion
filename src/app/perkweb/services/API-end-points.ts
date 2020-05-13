import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";

@Injectable()
export class APIEndPoints {
  constructor() {}
  public static fetchCompanyListUrl = "/api/company/all";
  public static createCompanyUrl = "/api/company";
  public static deleteCompanyUrl = "/api/company/";
  public static editCompanyUrl = "/api/company/";
  public static getCompanyByIdUrl = "/api/company/";
  public static parentCompanySelectionUrl = "/api/company/selectParent/";

  public static fetchVendorListUrl = "/api/vendor/all";
  public static getVendorByIdUrl = "/api/vendor/";
  public static createVendorUrl = "/api/vendor/";
  public static deleteVendorUrl = "/api/vendor/";

  public static fetchUserListUrl = "/api/user/all";
  public static getUserByIdUrl = "/api/user/";
  public static createUserUrl = "/api/user/";
  public static deleteUserUrl = "/api/user/";
  public static getEmployeesUrl = "/api/user/employee/";

  public static fetchDepartmentListUrl = "/api/department/all";
  public static fetchDesignationListUrl = "/api/designation/all";

  public static addOfferUrl = "/api/offer";
  public static fetchCategoryListUrl = "/api/offerCategory/all";
  public static fetchOfferListUrl = "/api/offer/all";
  public static getOfferByIdUrl = "/api/offer/";
  public static editOfferUrl = "/api/offer/";
  public static deleteOfferUrl = "/api/offer/";

  // urls for getting items for dropdown lists
  public static getCompanyItems = "api/company/items";
  public static getVendorItems = "api/vendor/items";
  public static getDepartmentItems = "api/department/items/";
  public static getDesignationItems = "api/designation/items/";
}
