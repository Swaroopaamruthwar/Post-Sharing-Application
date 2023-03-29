const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const postRoute = require("./routes/posts");
const authRoute = require("./routes/Auth");
dotenv.config({ path: "./config.env" });

// Create an express app
const app = express();
//console.log(process.env.url);
// Set up the middleware to parse incoming request bodies as JSON
app.use(express.json());

// Connect to the MongoDB database
mongoose
  .connect(process.env.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use("", postRoute);
app.use("", authRoute);

app.listen(3000, () => console.log("App listening on port 3000"));
