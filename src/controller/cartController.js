const { Cart } = require("../model/cartModel");
const mongoose = require("mongoose");

// Controller to get a user's cart
const getCart = async (req, res) => {
  console.log("getCart called");
  try {
    const { userId } = req.params; // Extract userId from request parameters
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Respond with the found cart
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Error fetching cart" });
  }
};

const addCart = async (req, res) => {
  console.log("add cart called");
  try {
    const { userId, product } = req.body; // product: productId, image, price, name

    if (!userId || !product) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let cart = await Cart.findOne({ userId });

    // If no cart, create a new cart
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Check if the product already exists in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === product.productId
    );

    if (productIndex === -1) {
      // Product not in cart, add new product
      // delete product._id;
      cart.products.push({
        ...product,
        // product: new mongoose.Types.ObjectId(product.productId),
      });
      cart.total += product.price;
    }

    await cart.save();

    // Respond with the updated cart
    return res.status(201).json(cart);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).json({ message: "Error adding product to cart" });
  }
};

const deleteCartItem = async (req, res) => {
  console.log("delet cart item called");
  try {
    const { userId, productId, price } = req.query;

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

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ message: "Invalid price" });
    }

    if (cart.products.length === 1) {
      await Cart.deleteOne({ userId }); // Menghapus seluruh cart
      return res
        .status(200)
        .json({ message: "Cart is empty and has been deleted" });
    }

    // Remove the item from the cart
    cart.products.splice(itemIndex, 1);
    // reducing total amount
    cart.total -= Number(price);

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
