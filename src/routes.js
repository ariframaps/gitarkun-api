const express = require("express");
const {
  getLatestProducts,
  getAllProducts,
  getSingleProductByName,
  getSingleProductById,
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
const {
  getTransactionToken,
} = require("./controller/paymentGatewayController");
const router = express.Router();

// ping
router.get("/", (req, res) => {
  return res.json({ message: "ping!" });
});

// public product
router.get("/product", getAllProducts); // tested
router.get("/product/latest", getLatestProducts); //tested
router.get("/product/name/:productName", getSingleProductByName); // tested
router.get("/product/id/:productId", getSingleProductById); // tested

// private product
router.get("/product/my/:sellerId", getMyProducts);
router.post("/product/my", addNewProduct); // tested
router.put("/product/my/:productId", editProduct);
router.delete("/product/my/:productId", deleteProduct);

// private order
router.get("/order/:userId", getOrders);
router.post("/order/:userId", addOrder);

// private cart
router.get("/cart/:userId", getCart);
router.post("/cart", addCart);
router.delete("/cart", deleteCartItem);

// private analytics
router.get("/analytics/:sellerId", getAnalytics);

// get transaction token
router.post("/get-transaction-token", getTransactionToken);

module.exports = router;
