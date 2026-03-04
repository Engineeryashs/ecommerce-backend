const mongoose = require("mongoose");
//Here a user will have a cart [array of cartItems]
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    items: [{
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            min: 1,             // ← Business rule
            default: 1
        },
        size:{
            type:String
        },
        price: {
            type: Number
        }
    }],
    totalPrice: {
        type: Number,
        default: 0
    }
})
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;