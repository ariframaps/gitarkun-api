const { Analytics } = require("../model/analyticsModel");

// Controller to get analytics data for a seller
const getAnalytics = async (req, res) => {
  try {
    const { sellerId } = req.params; // Extract sellerId from request parameters
    const analytics = await Analytics.findOne({ sellerId }).populate(
      "products.product"
    );

    if (!analytics) {
      return res.status(404).json({ message: "Analytics data not found" });
    }

    // Respond with the found analytics data
    return res.status(200).json({ analytics });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ message: "Error fetching analytics" });
  }
};

module.exports = {
  getAnalytics,
};
