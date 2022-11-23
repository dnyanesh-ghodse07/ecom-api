const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    products: [{
        productId: {
            type: String,
        },
        quantity: {
            type: Number,
            default: 1,
        }
    }],
    
},{timestamps: true})

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;