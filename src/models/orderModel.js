// Order Schema
const orderSchema = new mongoose.Schema({
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
      price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price must be a positive number"],
      },
    },
  ],
  total: {
    type: Number,
    required: [true, "Total amount is required"],
    min: [0, "Total amount must be a positive number"],
  },
  emailSent: {
    type: Boolean,
    default: false,
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
