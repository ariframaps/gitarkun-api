const midtransClient = require("midtrans-client");
/*Install midtrans-client (https://github.com/Midtrans/midtrans-nodejs-client) NPM package.
npm install --save midtrans-client*/

//SAMPLE REQUEST START HERE
const getTransactionToken = async (req, res) => {
  try {
    console.log("get transaction token ping!");
    const { gross_amount, customer_details, cart_items } = req.body;
    console.log(req.body);
    // Create Snap API instance
    let snap = new midtransClient.Snap({
      // Set to true if you want Production Environment (accept real transaction).
      isProduction: false,
      serverKey: process.env.SERRVER_MIDTRANS_KEY,
    });

    let parameter = {
      transaction_details: {
        order_id: Math.random() * 100000,
        gross_amount: gross_amount,
      },
      callbacks: {
        finish: "https://gitarkun.vercel.app/checkout-redirect",
      },
      item_details: cart_items,
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: customer_details.first_name,
        email: customer_details.email,
        phone: customer_details.phone,
      },
    };

    snap.createTransaction(parameter).then((transaction) => {
      // transaction token
      let transactionToken = transaction.token;
      console.log("transactionToken:", transactionToken);
      res.status(201).json({ transactionToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Error placing order" });
  }
};

module.exports = {
  getTransactionToken,
};
