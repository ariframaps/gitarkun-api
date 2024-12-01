const mongoose = require("mongoose");

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required"],
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required"],
      },
      image: {
        type: String,
        required: [true, "Product image is required"],
      },
      price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price must be a positive number"],
      },
      name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        unique: true,
      },
    },
  ],
  total: {
    type: Number,
    default: 0,
    required: [true, "Total amount is required"],
    min: [0, "Total amount must be a positive number"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Error Handling for Mongoose operations
cartSchema.post("save", function (error, doc, next) {
  if (error.name === "ValidationError") {
    next(
      new Error(
        "Cart validation failed: " +
          Object.values(error.errors)
            .map((e) => e.message)
            .join(", ")
      )
    );
  } else {
    next(error);
  }
});

module.exports.Cart = mongoose.model("Cart", cartSchema);
module.exports.CartSchema;
