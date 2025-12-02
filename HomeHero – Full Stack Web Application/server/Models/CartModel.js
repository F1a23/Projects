import mongoose from "mongoose";

// Define the schema for a cart item
const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Assuming there is a Product model
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  scode: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  noWorks: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  Time: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

// Define the schema for a cart
const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming there is a User model
    required: true,
  },
  items: [CartItemSchema],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add a pre-save hook to calculate the total price
CartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce((acc, item) => acc + item.total, 0);
  this.updatedAt = Date.now();
  next();
});

const CartModel = mongoose.model("Cart", CartSchema);
export default CartModel;
