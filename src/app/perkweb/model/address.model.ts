export class Address {
  id?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;

  constructor(
    id?: string,
    address_line1?: string,
    address_line2?: string,
    city?: string,
    state?: string,
    country?: string,
    zipcode?: string
  ) {
    this.id = id;
    this.address_line1 = address_line1;
    this.address_line2 = address_line2;
    this.city = city;
    this.state = state;
    this.country = country;
    this.zipcode = zipcode;
  }
}
