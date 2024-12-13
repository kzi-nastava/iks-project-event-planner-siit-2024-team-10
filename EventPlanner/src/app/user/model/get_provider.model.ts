import { Location } from "../../event/model/location.model";
import { GetCompany } from "./company.model";

export interface GetProvider {
    id: number;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    location: Location;
    company: GetCompany
  }
  