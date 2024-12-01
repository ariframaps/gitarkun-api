const { Order } = require("../model/orderModel");
const { Cart } = require("../model/cartModel");
const { Product } = require("../model/productModel");
const { Analytics } = require("../model/analyticsModel");

// Controller to get the products a user has purchased
const getOrders = async (req, res) => {
  try {
    const userId = req.params.userId; // Clerk user ID from authentication
    const orders = await Order.find({ buyerId: userId }).populate(
      "products.product"
    );

    // If no orders are found for the user
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    // Get all product IDs from the orders
    const products = orders.flatMap((order) =>
      order.products.map((p) => p.product)
    );

    res
      .status(200)
      .json({ message: "successfully getting orders", data: products });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

const addOrder = async (req, res) => {
  try {
    const userId = req.params.userId; // Clerk user ID

    // Find the user's cart
    const cart = await Cart.findOne({ userId }).populate({
      path: "products.product",
      select: "name image category link isDeleted",
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart is empty. Add items to the cart before checkout.",
      });
    }

    // Copy cart contents to orders
    const newOrder = new Order({
      buyerId: cart.userId,
      products: cart.products,
      totalAmount: cart.total,
    });
    await newOrder.save();

    // Update seller analytics for each product in the cart
    for (const item of cart.products) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        console.error(`Product with ID ${item.product._id} not found.`);
        continue;
      }

      let sellerAnalytics = await Analytics.findOne({
        sellerId: product.sellerId,
      });
      if (!sellerAnalytics) {
        console.error(`Analytics not found for seller ${product.sellerId}.`);
        const newAnalytics = new Analytics({
          sellerId: product.sellerId,
          totalSales: 0,
          totalRevenue: 0,
          productStats: [],
        });
        sellerAnalytics = await newAnalytics.save();
      }

      // Find product stats in seller's analytics
      const productStat = sellerAnalytics.productStats.find(
        (p) => p.product.toString() === item.product._id.toString()
      );
      if (productStat) {
        // Update existing stats
        productStat.salesCount += 1;
        productStat.revenue += item.price;
      } else {
        // Add new product stats
        sellerAnalytics.productStats.push({
          product: item.product._id,
          salesCount: 1,
          revenue: item.price,
        });
      }

      // Update total sales and revenue
      sellerAnalytics.totalSales += 1;
      sellerAnalytics.totalRevenue += item.price;

      // Save updated analytics
      await sellerAnalytics.save();
    }

    // Clear the user's cart after successful checkout
    await Cart.deleteOne({ userId });

    res
      .status(201)
      .json({ message: "Order placed successfully", data: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order" });
  }
};

module.exports = {
  getOrders,
  addOrder,
};
