export interface UpdateProductDTO {
  name: string;
  description: string;
  price: number;
  discount: number;
  photos: string[];
  isVisible: boolean;
  isAvailable: boolean;
}
