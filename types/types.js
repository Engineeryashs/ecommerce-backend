const {z}=require("zod");
const userSignupSchema=z.object({
    name:z.string(),
    email:z.email(),
    password:z.string().min(6).max(14)
})

const userSigninSchema=z.object({
    email:z.email(),
    password:z.string().min(6).max(14)
})

const productsSchema=z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  subcategory: z.string(),
  prices: z.coerce.number().positive(),
  bestSeller: z.coerce.boolean(),
  size: z.string(),
})
module.exports={userSignupSchema,productsSchema,userSigninSchema}