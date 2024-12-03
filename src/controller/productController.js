const { Product } = require("../model/productModel");

// Get the latest 9 products
const getLatestProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(9); // Sorting by newest
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json(products);
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
    const { page = 1, limit = 9 } = req.query;
    const skip = (page - 1) * limit; // Hitung offset berdasarkan page dan limit

    const products = await Product.find();
    // .skip(skip) // Skip produk berdasarkan offset
    // .limit(Number(limit)); // Batasi produk sesuai limit; // Filter and sorting as needed

    // Ambil total jumlah produk untuk pagination
    // const totalItems = await Product.countDocuments(); // Total produk yang sesuai filter

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching all products:", error.message);
    return res.status(500).json({ message: "Error fetching all products" });
  }
};

// Get a single product by its ID
const getSingleProductById = async (req, res) => {
  try {
    let product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    return res.status(500).json({ message: "Error fetching product" });
  }
};

// Get a single product by its name
const getSingleProductByName = async (req, res) => {
  try {
    const productName = req.params.productName.split("_").join(" ");
    let product = await Product.findOne({ name: productName });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
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
    console.log(req.params.sellerId, "getMyProducts");
    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this seller" });
    }
    return res.status(200).json({ products });
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

    console;

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
    return res.status(201).json(newProduct);
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

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error editing product:", error);
    return res.status(500).json({ message: "Error editing product" });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedProduct = await Product.findByIdAndUpdate(
      productId, // The ID of the product you want to "delete"
      { isDeleted: true }, // Update the isDeleted field to true
      { new: true } // Return the updated document
    );

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(deletedProduct);
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Error deleting product" });
  }
};

module.exports = {
  getLatestProducts,
  getAllProducts,
  getSingleProductById,
  getSingleProductByName,
  getMyProducts,
  addNewProduct,
  editProduct,
  deleteProduct,
};
