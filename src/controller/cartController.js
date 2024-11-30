const { Cart } = require("../model/cartModel");

// Controller to get a user's cart
const getCart = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request parameters
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Respond with the found cart
    return res.status(200).json({ cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Error fetching cart" });
  }
};

/**
 * @route POST /cart
 * @desc Add a product to the cart
 * @access Public
 *
 * Request Body:
 * {
 *   userId: string,      // ID of the user
 *   productId: string,   // ID of the product to add
 *   quantity: number     // Quantity to add
 * }
 *
 * Response:
 * 201 - Product added to cart
 * 400 - Missing required fields
 * 500 - Error adding product to cart
 */
const addCart = async (req, res) => {
  try {
    const { userId, productId, price } = req.body;

    if (!userId || !productId || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let cart = await Cart.findOne({ userId });

    // If no cart, create a new cart
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Check if the product already exists in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      // Product not in cart, add new product
      cart.products.push({ product: productId, price });
      cart.total += price;
    }

    await cart.save();

    // Respond with the updated cart
    return res.status(201).json({ cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).json({ message: "Error adding product to cart" });
  }
};

/**
 * @route DELETE /cart/:userId/:productId
 * @desc Delete an item from the cart
 * @access Public
 *
 * Response:
 * 200 - Item removed from cart
 * 404 - Cart or product not found
 * 500 - Error deleting cart item
 */
const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId, price } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the item from the cart
    cart.products.splice(itemIndex, 1);
    // reducing total amount
    cart.total -= price;

    await cart.save();

    return res
      .status(200)
      .json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return res.status(500).json({ message: "Error deleting cart item" });
  }
};

module.exports = {
  getCart,
  addCart,
  deleteCartItem,
};
