import { Company } from "./company.model";
import { Vendor } from "./vendor.model";
import { OfferClaimDetails } from "./offer-claim-details";
import { OfferImage } from "./offer-image";
import { OfferCategory } from "./offer-category";
import { Group } from "./group.model";

export class Offer {
  id?: string;
  offerName?: string;
  offerType?: string;
  code?: string;
  url?: string;
  snippet?: string;
  redemptionUrl?: string;
  offerStartDate?: string;
  offerEndDate?: string;
  offerStatus?: string;
  group?: Group;
  categories?: OfferCategory[];
  companies?: Company[];
  vendor?: Vendor;
  claimDetails?: OfferClaimDetails;
  image?: OfferImage[];
  singleUseOnly?: boolean;
  disabled?: boolean;
  
  public constructor() {}
}
