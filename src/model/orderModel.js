const mongoose = require("mongoose");
const { cartSchema } = require("./cartModel");

// Order Schema
const orderSchema = new mongoose.Schema({
  buyerId: {
    type: String,
    required: [true, "User ID is required"],
  },
  products: [
    {
      product: {
        type: new mongoose.Schema({
          name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
          },
          image: {
            type: String,
            required: [true, "Product image is required"],
          },
          category: {
            type: String,
            required: [true, "Product category is required"],
            trim: true,
          },
          link: {
            type: String,
            required: [true, "Product link (PDF) is required"],
            validate: {
              validator: function (v) {
                return /^(ftp|http|https):\/\/[^ "]+$/.test(v); // Validate URL format
              },
              message: "Invalid URL format for product link",
            },
          },
          isDeleted: {
            type: Boolean,
            default: false,
          },
        }),
        required: [true, "Product is required"],
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
    min: [0, "Total amount must be a positive number"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Error Handling for Mongoose operations
orderSchema.post("save", function (error, doc, next) {
  if (error.name === "ValidationError") {
    next(
      new Error(
        "Order validation failed: " +
          Object.values(error.errors)
            .map((e) => e.message)
            .join(", ")
      )
    );
  } else {
    next(error);
  }
});

module.exports.Order = mongoose.model("Order", orderSchema);
