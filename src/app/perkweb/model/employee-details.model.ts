import { Designation } from "./designation.model";
import { Department } from "./department.model";
import { Address } from "./address.model";

export class EmployeeDetails {
  id?: string;
  employeeId?: string;
  joiningDate?: string;
  nationality?: string;
  compAdmin?: boolean;
  corporationAdmin?: boolean;
  designation?: Designation;
  department?: Department;
  officeAddress?: Address;
}
