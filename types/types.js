const { z } = require("zod");
const userSignupSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6).max(14)
})

const userSigninSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(14)
})

const productsSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    category: z.array(z.string()),
    subcategory: z.string(),
    bestSeller: z.coerce.boolean(),//automatically converts strings or numbers to boolean as from form-data we will recieve strings only
    variants: z.array(z.object({
        prices: z.coerce.number().positive(),
        size: z.string(),
        stock: z.number().min(0)
    }))

})
module.exports = { userSignupSchema, productsSchema, userSigninSchema }