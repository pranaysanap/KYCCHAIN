import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// ✅ Register Route
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, accountType, password, confirmPassword } = req.body;

    // Basic validation
    if (!fullName || !email || !accountType || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      fullName,
      email,
      accountType,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.json({ message: "User registered successfully 🚀" });

  } catch (error) {
    console.error("regi Error:", error); // <-- this prints the real error
    res.status(500).json({ error: error.message });
}


});

// ✅ Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, fullName: user.fullName, accountType: user.accountType },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: "Login successful ✅",
      user: { fullName: user.fullName, accountType: user.accountType },
      token
    });

  } catch (error) {
    console.error("Login Error:", error); // <-- this prints the real error
    res.status(500).json({ error: error.message });
}

});

export default router;
