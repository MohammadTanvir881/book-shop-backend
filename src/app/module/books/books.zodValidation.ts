import { z } from "zod";

// Define the Zod schema
const booksZodValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Books Title Are Required"),
    // bookImage: z.string().optional(),
    author: z.string().min(1, "Author is Required"),
    bookImage: z.string(),
    price: z.number().min(0, "Price is Required and must be a positive number"),
    category: z.string().min(1, "Category is required"),
    description: z.string().min(1, "Description is required"),
    quantity: z
      .number()
      .min(0, "Quantity is required and must be a positive number"),
    inStock: z
      .boolean()
      .refine((value) => value !== undefined, "InStock is required"),
    isDeleted: z.boolean().optional(),
  }),
});

export default booksZodValidationSchema;
