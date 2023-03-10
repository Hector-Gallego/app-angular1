export interface Details{
  productId: number;
  productName: string;
  quantity: number;
}

export interface Order{
  id: number;
  name: string;
  shippingAdress: string;
  city: string;
  date: string;
  isDelivery: boolean;
}

export interface DetailsOrder{
  details: Details[];
  orderId: number;
}
