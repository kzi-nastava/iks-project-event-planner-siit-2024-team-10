export interface CreateProductDTO {
  categoryId:number;
  categoryProposalName:string;
  categoryProposalDescription:string;
  providerID:number;
  name:string;
  description:string;
  price:number;
  discount:number;
  photos:string[];
  visible:boolean;
  available:boolean;
  creatorId: number;
}
