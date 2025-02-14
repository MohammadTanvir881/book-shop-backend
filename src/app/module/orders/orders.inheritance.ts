export type TOrders = {
  email: string;
  product: string;
  quantity: number;
  totalPrice: number;
  address: string;
  phone: number;
  paidStatus: boolean;
  tranjectionId: string;
  isShipped?: boolean;
};
