// Analytics Schema (Optional for seller dashboard)
const analyticsSchema = new mongoose.Schema({
  sellerId: {
    type: String,
    required: [true, "Seller ID is required"],
  },
  totalSales: {
    type: Number,
    default: 0,
    min: [0, "Total sales must be a positive number"],
  },
  totalRevenue: {
    type: Number,
    default: 0,
    min: [0, "Total revenue must be a positive number"],
  },
  productStats: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is required"],
      },
      salesCount: {
        type: Number,
        default: 0,
        min: [0, "Sales count must be a positive number"],
      },
      revenue: {
        type: Number,
        default: 0,
        min: [0, "Revenue must be a positive number"],
      },
    },
  ],
});

// Error Handling for Mongoose operations
analyticsSchema.post("save", function (error, doc, next) {
  if (error.name === "ValidationError") {
    next(
      new Error(
        "Analytics validation failed: " +
          Object.values(error.errors)
            .map((e) => e.message)
            .join(", ")
      )
    );
  } else {
    next(error);
  }
});

module.exports.Analytics = mongoose.model("Analytics", analyticsSchema);
