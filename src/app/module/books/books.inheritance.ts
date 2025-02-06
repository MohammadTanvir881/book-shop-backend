export type TBooks = {
  title: string;
  author: string;
  bookImage: string;
  price: number;
  category: string;
  description: string;
  quantity: number;
  inStock: boolean;
  isDeleted?: boolean;
};
