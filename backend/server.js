require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./User");
const Cart = require("./Cart");

const app = express();

// Update CORS configuration to be more permissive during development
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Connection Error:", err));

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/auth/user", authenticateUser, (req, res) => {
  res.json(req.user);
});


app.get("/", (req, res) => {
  res.send("API running...");
});

app.post("/signup", async (req, res) => {
  const { fname, lname, email, password } = req.body;
  if (!fname || !lname || !email || !password) return res.status(400).json({ error: "All fields are required" });

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ fname, lname, email, password: hashedPassword });
    await user.save();
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/"
    });

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a logout endpoint
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
  res.json({ message: "Logged out successfully" });
});

app.post("/cart/add", authenticateUser, async (req, res) => {
  const { item } = req.body;
  const email = req.user.email;

  if (!item) return res.status(400).json({ error: "Invalid request" });

  try {
    let cart = await Cart.findOne({ user: email });

    if (!cart) {
      cart = new Cart({ user: email, products: [item] });
    } else {
      const existingItem = cart.products.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.products.push(item);
      }
    }

    await cart.save();
    res.json({ message: "Item added to cart", cart: cart.products });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/cart/get", authenticateUser, async (req, res) => {
  const email = req.user.email;

  try {
    const cart = await Cart.findOne({ user: email });

    if (!cart) return res.json({ cart: [] });

    res.json({ cart: cart.products });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/cart/remove", authenticateUser, async (req, res) => {
  const { itemId } = req.body;
  const email = req.user.email;

  try {
    const cart = await Cart.findOne({ user: email });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = cart.products.filter((item) => item.id !== itemId);
    await cart.save();

    res.json({ message: "Item removed from cart", cart: cart.products });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
