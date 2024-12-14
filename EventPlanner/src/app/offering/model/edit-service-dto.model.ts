export interface EditServiceDTO {
    id: number;
    pending: boolean;
    provider: number;
    name: string;
    description: string;
    specification: string;
    price: number;
    discount: number;
    photos: string[];
    isVisible: boolean;
    isAvailable: boolean;
    maxDuration: number;
    minDuration: number;
    cancellationPeriod: number;
    reservationPeriod: number;
    autoConfirm: boolean;
  }
  