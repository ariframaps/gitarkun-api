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
const {
  getCart,
  addCart,
  deleteCartItem,
} = require("./controller/cartController");
const { getAnalytics } = require("./controller/analyticsController");
const router = express.Router();

// ping
router.get("/", (req, res) => {
  return res.json({ message: "ping!" });
});

// public product
router.get("/product", getAllProducts); // tested
router.get("/product/latest", getLatestProducts); //tested
router.get("/product/:productId", getSingleProduct); // tested

// private product
router.get("/product/my/:sellerId", getMyProducts);
router.post("/product/my", addNewProduct); // tested
router.put("/product/my/:productId", editProduct);
router.delete("/product/my/:productId", deleteProduct);

// private order
router.get("/order", getOrders);
router.post("/order", addOrder);

// private cart
router.get("/cart", getCart);
router.post("/cart", addCart);
router.delete("/cart", deleteCartItem);

// private analytics
router.get("/analytics", getAnalytics);

module.exports = router;
