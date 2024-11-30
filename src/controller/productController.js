const { Product } = require("../model/productModel");

// Get the latest 9 products
const getLatestProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(9); // Sorting by newest
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json({
      message: "Latest products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching latest products:", error.message);
    return res.status(500).json({
      message: "Error fetching latest products",
    });
  }
};

// Get all products with filters and sorting
const getAllProducts = async (req, res) => {
  try {
    const { filter = {}, sort = {} } = req.query;
    const products = await Product.find(filter).sort(sort); // Filter and sorting as needed
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    return res
      .status(200)
      .json({ message: "All products fetched successfully", data: products });
  } catch (error) {
    console.error("Error fetching all products:", error.message);
    return res.status(500).json({ message: "Error fetching all products" });
  }
};

// Get a single product by its ID
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res
      .status(200)
      .json({ message: "Product fetched successfully", data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    return res.status(500).json({ message: "Error fetching product" });
  }
};

// Get all products by a specific seller
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.params.sellerId });
    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this seller" });
    }
    return res.status(200).json({
      message: "Seller's products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return res.status(500).json({
      message: "Error fetching seller products",
    });
  }
};

// Add a new product
const addNewProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      price,
      difficulty,
      link,
      category,
      sellerId,
    } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !image ||
      !difficulty ||
      !link ||
      !category ||
      !sellerId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({
      name,
      description,
      image,
      difficulty,
      link,
      category,
      price,
      sellerId,
    });

    await newProduct.save();
    return res
      .status(201)
      .json({ message: "Product added successfully", data: newProduct });
  } catch (error) {
    console.error("Error adding new product:", error);
    return res.status(500).json({ message: "Error adding new product" });
  }
};

// Edit a product
const editProduct = async (req, res) => {
  try {
    const { price, description } = req.body;
    const { productId } = req.params;

    if (!price && !description) {
      return res.status(400).json({
        message: "At least one field (price or description) must be provided",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { price, description },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    console.error("Error editing product:", error);
    return res.status(500).json({ message: "Error editing product" });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Error deleting product" });
  }
};

module.exports = {
  getLatestProducts,
  getAllProducts,
  getSingleProduct,
  getMyProducts,
  addNewProduct,
  editProduct,
  deleteProduct,
};
