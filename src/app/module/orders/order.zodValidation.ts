import { z } from "zod";

export const orderValidationSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    product: z.string(),
    quantity: z
      .number()
      .min(1)
      .positive("Quantity must be greater than zero")
      .int("Quantity must be an integer"),
    totalPrice: z.number().positive("Total price must be greater than zero"),
    address: z.string(),
    phone: z.number(),
  }),
});

export const OrderValidation = {
  orderValidationSchema,
};
