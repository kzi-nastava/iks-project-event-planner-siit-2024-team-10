export interface UpdatedProductDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  photos: string[];
  isVisible: boolean;
  isAvailable: boolean;
}
