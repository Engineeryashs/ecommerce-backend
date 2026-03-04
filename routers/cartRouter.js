const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const Cart = require("../db/models/Cart");
const Products = require("../db/models/Products");
const router = express.Router();


router.post("/addtoCart", authMiddleware, async (req, res) => {
    //Cart should be array of object
    //Find the cart with userId
    try {
        const userId = req.user.userId
        const { size, productId, quantity } = req.body;
        let found = false;
        const isCart = await Cart.findOne({
            user: userId
        })

        const Product = await Products.findById(productId);
        console.log(Product)
        if (!Product) {
            return res.status(404).json({ msg: "Product not found" });
        }
        //check whether stock is there or not for the given size 
        /*Matlab yahi project mein meko check karna hai kya given size hai ya nahi aur agar
        hai toh fir meko woh size ka price jo hoga woh price lena hai aur uska stock 
        bhi dekhna hai agar stock s jyada quantity maang raha hai toh mein fir cart nahi banauga*/
        const varianceArray = Product.variants;
        let prices;
        let isThere = false;
        let stock;
        varianceArray.forEach(ele => {
            if (ele.size === size) {
                isThere = true;
                stock = ele.stock;
                prices = ele.prices;
            }
        })
        if (!isThere) {
            return res.status(403).json({
                msg: "No products are there of given size"
            })
        }
        if (stock < quantity) {
            return res.status(409).json({
                msg: "Out of stock"
            })
        }


        if (!isCart) {
            /*that is if there is not anything in the cart or cart is empty then 
            push the new elements in the cart directly*/


            const newCart = await Cart.create({
                user: userId,
                items: [{
                    productId: productId, //Well I don't know about productid i think user will give it
                    quantity: quantity || 1, // We wanna fetch it from user
                    price: prices,     //We wanna fetch it from it db
                    size: size       //User will select it
                }]
            })

            return res.json({
                msg: "Cart created successfully",
                cart: newCart
            })
        }
        /*If cart is available then we will check is that product have same productId 
        and same size if yes then increase its quantity in the stock */
        for (let ele of isCart.items) {
            if (ele.productId.toString() === productId && ele.size === size) {

                if (ele.quantity + quantity > stock) {
                    return res.status(409).json({
                        msg: "Out of stock"
                    });
                }

                ele.quantity += quantity;
                found = true;
                break; // very important
            }
        }
        if (!found) {
            isCart.items.push({
                productId: productId,
                quantity: quantity || 1,
                price: prices,
                size: size
            })
        }
        await isCart.save();
        return res.json({
            msg: "Cart updated successfully -2",
            isCart: isCart
        })
        //No need to update stock we will update it once a payment will be done
        /*Now if there is any cart then find the products to be added and if that
        product is in the cart then increase the quantity and if that product is not 
        there then add to cart*/
        //Well at last we will add stock thing also
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Internal Server error",
            err: error
        })
    }
})

router.put("/deleteCart", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId, size } = req.body;
        const deleteCartElement = await Cart.updateOne(
            { user: userId },//filter field
            { $pull: { items: { productId:new mongoose.Types.ObjectId(productId),size:size } } } //items is array where productId is field u have to match to delete that element from items array
            //i.e pull productId from the items array
        )
        console.log(deleteCartElement);
        if(deleteCartElement.modifiedCount==0){
            return res.status(404).json({
                msg:"Give Item does not exists"
            })
        }
    /*Agar cart empty hojaati hai toh mein uss user k liye cart ko bhi delete karduga
    Yeh ek optional cheez ho sakti hain chcho toh delete karo qki nayi query lagnhe per waise bhi
    woh naya bana hi lega
    if(deleteCartElement.isEmpty()){
        await Cart.delete({
            user:userId
        })
        res.json({
            msg:"Cart is emptied"
        })
    }*/

        res.json({
            msg:"Cart item deleted",
        })
    } catch (error) {
     res.status(500).json({
        msg:"Internal Server Error"
     })
}
})

/*Matlab ki agar user signed in hai tabhi mujhe cart dikhana hai aur agar user signed in
nahi hai toh meko cart nahi dikhana hai*/


router.get("/getCartData",authMiddleware,async(req,res)=>{
try {
    const userId=req.user.userId;
    const cartData=await Cart.findOne({
        user:userId
    })
    console.log(cartData);
    res.json({
        msg:"This is your cart data",
        cartData:cartData
    })
} catch (error) {
    res.status(500).json({
        msg:"Internal server error"
    })
}
})

module.exports = router;