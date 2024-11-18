import { Offering } from "./offering.model";

export interface Service extends Offering{
    specification?: string;
    minDuration?: number;
    maxDuration?: number;
    cancelationPeriod?: number;
    reservationPeriod?: number;
    autoConfirm?: boolean;
}