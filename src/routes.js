const express = require("express");
const {
  getLatestProducts,
  getAllProducts,
  getSingleProduct,
  getMyProducts,
  addNewProduct,
  editProduct,
  deleteProduct,
} = require("./controller/productController");
const { getOrders, addOrder } = require("./controller/orderController");
const { getCart, addCart } = require("./controller/cartController");
const { getAnalytics } = require("./controller/analyticsController");
const router = express.Router();

// public product
router.get("/product", getAllProducts);
router.get("/product/latest", getLatestProducts);
router.get("/product/:productId", getSingleProduct);

// private product
router.get("/product/my-product", getMyProducts);
router.post("/product", addNewProduct);
router.put("/product/:productId", editProduct);
router.delete("/product/:productId", deleteProduct);

// private order
router.get("/order", getOrders);
router.post("/order", addOrder);

// private cart
router.get("/cart", getCart);
router.post("/cart", addCart);
router.delete("/cart", deleteCart);

// private analytics
router.get("/analytics", getAnalytics);

module.exports = router;
