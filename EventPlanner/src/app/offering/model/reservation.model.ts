import { Service } from "./service.model";

export interface Reservation{
    id: number;
    startTime: Date;
    endTime: Date;
    status: string;
    event: string;
    service: Service;
}