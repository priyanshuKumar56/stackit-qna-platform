const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    location: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    reputation: {
      type: Number,
      default: 0,
    },
    badges: {
      gold: { type: Number, default: 0 },
      silver: { type: Number, default: 0 },
      bronze: { type: Number, default: 0 },
    },
    questionsCount: {
      type: Number,
      default: 0,
    },
    answersCount: {
      type: Number,
      default: 0,
    },
    votesReceived: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Update reputation method
userSchema.methods.updateReputation = function (points) {
  this.reputation += points

  // Update badges based on reputation
  if (this.reputation >= 1000 && this.badges.gold === 0) {
    this.badges.gold += 1
  }
  if (this.reputation >= 500 && this.badges.silver === 0) {
    this.badges.silver += 1
  }
  if (this.reputation >= 100 && this.badges.bronze === 0) {
    this.badges.bronze += 1
  }

  return this.save()
}

module.exports = mongoose.model("User", userSchema)
