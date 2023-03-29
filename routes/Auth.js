const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");
router.use(bodyparser());
router.use(bodyparser.urlencoded({ extended: false }));
// Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// Login as an existing user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET);
    res.status(200).send({ token });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});
module.exports = router;
