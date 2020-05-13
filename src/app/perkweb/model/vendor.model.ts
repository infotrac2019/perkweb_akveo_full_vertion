import { Image } from "./image.model";
import { Address } from "./address.model";
export class Vendor {
  id?: string;
  vendorName?: string;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  unlockPin?: string;
  contactPerson?: string;
  contactNumber?: string;
  address?: Address;
  logoImage?: Image;

  constructor(
    id?: string,
    vendorName?: string,
    ownerId?: string,
    ownerName?: string,
    ownerEmail?: string,
    unlockPin?: string,
    contactPerson?: string,
    contactNumber?: string,
    address?: Address,
    logoImage?: Image
  ) {
    this.id = id;
    this.vendorName = vendorName;
    this.ownerId = ownerId;
    this.ownerName = ownerName;
    this.ownerEmail = ownerEmail;
    this.unlockPin = unlockPin;
    this.contactPerson = contactPerson;
    this.contactNumber = contactNumber;
    this.address = address;
    this.logoImage = logoImage;
  }
}
