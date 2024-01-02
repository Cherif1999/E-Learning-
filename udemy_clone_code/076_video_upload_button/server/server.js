import express from "express";
import cors from "cors";
import { readdirSync } from "fs";
import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser";
const morgan = require("morgan");
require("dotenv").config();

// Create express app
const app = express();

// Connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/edemy', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('DB CONNECTION ERR => ', error);
  });

// Apply middlewares
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Routes
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

// CSRF token endpoint
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Define the port
const port = process.env.PORT || 5005;

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}`));
