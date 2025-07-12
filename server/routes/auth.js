const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? "Email already exists" : "Username already exists",
      })
    }

    // Create new user
    const user = new User({
      name,
      username,
      email,
      password,
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        location: user.location,
        website: user.website,
        avatar: user.avatar,
        reputation: user.reputation,
        badges: user.badges,
        questionsCount: user.questionsCount,
        answersCount: user.answersCount,
        votesReceived: user.votesReceived,
        viewsCount: user.viewsCount,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        location: user.location,
        website: user.website,
        avatar: user.avatar,
        reputation: user.reputation,
        badges: user.badges,
        questionsCount: user.questionsCount,
        answersCount: user.answersCount,
        votesReceived: user.votesReceived,
        viewsCount: user.viewsCount,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        bio: req.user.bio,
        location: req.user.location,
        website: req.user.website,
        avatar: req.user.avatar,
        reputation: req.user.reputation,
        badges: req.user.badges,
        questionsCount: req.user.questionsCount,
        answersCount: req.user.answersCount,
        votesReceived: req.user.votesReceived,
        viewsCount: req.user.viewsCount,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
