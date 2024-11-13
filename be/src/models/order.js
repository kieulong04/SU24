import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
});

const customerInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
});

const orderSchema = new mongoose.Schema({
    items: [orderItemSchema],
    orderNumber: {
        type: String,
        required: true,
        unique: true,
    },
    customerInfo: {
        type: customerInfoSchema,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    history: [
        {
            date: {
                type: Date,
                default: Date.now,
            },
            status: {
                type: String,
                enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            },
        },
    ],
});

const Order = mongoose.model('Order', orderSchema);

export default Order;