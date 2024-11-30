const express = require("express");
const http = require("http");
const router = require("./src/routes");
const cors = require("cors");
require("dotenv").config();
const { default: mongoose } = require("mongoose");

const app = express();
const server = http.createServer(app);

// Define CORS options
const corsOptions = {
  origin: "http://localhost:3000", // Allow this origin. OWASP top ten
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
  credentials: true,
};

app.use(cors(corsOptions)); // Apply CORS middleware with options
app.use(express.json());
app.use("/", router);

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 7000;

mongoose
  .connect(MONGO_URL)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Connection failed:", err);
  });
