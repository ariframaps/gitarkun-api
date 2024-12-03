const { Cart } = require("../model/cartModel");
const mongoose = require("mongoose");

// Controller to get a user's cart
const getCart = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request parameters
    console.log(userId);
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
  try {
    const { userId, product } = req.body; // product: productId, image, price, name
    console.log(userId, product);

    if (!userId || !product) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let cart = await Cart.findOne({ userId });
    console.log(cart);

    // If no cart, create a new cart
    if (!cart) {
      cart = new Cart({ userId, products: [] });
      console.log(cart);
    }

    // Check if the product already exists in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === product.productId
    );
    console.log(productIndex);

    if (productIndex === -1) {
      // Product not in cart, add new product
      delete product._id;
      cart.products.push({
        ...product,
        product: new mongoose.Types.ObjectId(product.productId),
      });
      console.log(cart);
      cart.total += product.price;
    }

    await cart.save().then((res) => console.log(res));

    // Respond with the updated cart
    return res.status(201).json(cart);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return res.status(500).json({ message: "Error adding product to cart" });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId, price } = req.query;
    console.log(userId, productId, price, "ini delete bos");

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );
    console.log(itemIndex);
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

    await cart.save().then((res) => console.log(res));

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
