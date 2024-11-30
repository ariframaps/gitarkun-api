const { Order } = require("../model/orderModel");
const { Cart } = require("../model/cartModel"); // Assuming Cart model is imported

// Controller to fetch orders for a specific buyer
const getOrders = async (req, res) => {
  try {
    const { buyerId } = req.params; // Extract buyerId from request parameters
    const orders = await Order.find({ buyerId });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    // Respond with the found orders
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Error fetching orders" });
  }
};

/**
 * @route POST /orders
 * @desc Add a new order
 * @access Public
 *
 * Request Body:
 * {
 *   userId: string,      // ID of the buyer
 *   products: [Object],  // List of products in the order
 *   totalAmount: number  // Total price of the order
 * }
 *
 * Response:
 * 200 - New order created successfully
 * 400 - Missing required fields
 * 500 - Error adding new order
 */
const addNewOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount } = req.body;

    // Check if all required fields are provided
    if (!userId || !products || !totalAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new order
    const newOrder = new Order({
      buyerId: userId,
      products,
      totalAmount,
    });

    await newOrder.save();

    // Clear the user's cart after order creation
    await Cart.findOneAndDelete({ userId });

    // Respond with the created order
    return res.status(201).json({ newOrder });
  } catch (error) {
    console.error("Error adding new order:", error);
    return res.status(500).json({ message: "Error adding new order" });
  }
};

module.exports = {
  getOrders,
  addNewOrder,
};
