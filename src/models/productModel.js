const mongoose = require("mongoose");

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description should be at least 10 characters long"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price must be a positive number"],
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: [true, "Difficulty level is required"],
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
    sellerId: {
      type: String,
      required: [true, "Seller ID is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Error Handling for Mongoose operations
productSchema.post("save", function (error, doc, next) {
  if (error.name === "ValidationError") {
    next(
      new Error(
        "Product validation failed: " +
          Object.values(error.errors)
            .map((e) => e.message)
            .join(", ")
      )
    );
  } else {
    next(error);
  }
});

module.exports.Product = mongoose.model("Product", productSchema);
