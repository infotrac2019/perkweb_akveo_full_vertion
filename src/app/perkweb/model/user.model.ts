import { EmployeeDetails } from "./employee-details.model";
import { Company } from "./company.model";
import { Address } from "./address.model";
import { Group } from "./group.model";

export class User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  contactNumber?: string;
  gender?: string;
  userType?: string;
  primaryUser?: EmployeeDetails;
  group?: Group;
  company?: Company;
  employeeDetails?: EmployeeDetails;
  address?: Address;
}
