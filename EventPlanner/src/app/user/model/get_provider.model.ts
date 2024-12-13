import { Location } from "../../event/model/location.model";
import { GetCompany } from "./company.model";

export interface GetProvider {
    _id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePhoto?: string;
    location: Location;
    company: GetCompany
  }
  