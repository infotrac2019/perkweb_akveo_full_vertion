import { Address } from "./address.model";
import { Vendor } from "./vendor.model";
import { Department } from './department.model';
import { Designation } from './designation.model';

export class Company {
  id?: string;
  companyName?: string;
  domainName?: string;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  logoUrl?: string;
  pointsPerDollar?: number;
  reserveAlert?: number;
  reserveBcc?: string;
  active?: boolean;
  address?: Address;
  blacklistedVendors?: Vendor[];
  corporation?: Company;
  activeStr?: string;
  departments?: Department[];
  designations?: Designation[];

  public constructor(
    id?: string,
    companyName?: string,
    domainName?: string,
    ownerId?: string,
    ownerName?: string,
    ownerEmail?: string,
    logoUrl?: string,
    pointsPerDollar?: number,
    reserveAlert?: number,
    reserveBcc?: string,
    active?: boolean,
    address?: Address,
    blacklistedVendors?: Vendor[],
    corporation?: Company,
    departments?: Department[],
    designations?: Designation[]
  ){
    this.id=id;
    this.companyName = companyName;
    this.domainName = domainName;
    this.ownerId = ownerId;
    this.ownerName = ownerName;
    this.ownerEmail = ownerEmail;
    this.logoUrl = logoUrl;
    this.pointsPerDollar = pointsPerDollar;
    this.reserveAlert = reserveAlert;
    this.reserveBcc = reserveBcc;
    this.active = active;
    this.address = address;
    this.blacklistedVendors = blacklistedVendors;
    this.corporation = corporation;
    this.departments = departments;
    this.designations = designations;
  }


}
