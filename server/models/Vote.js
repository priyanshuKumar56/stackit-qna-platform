const mongoose = require("mongoose")

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },
    targetType: {
      type: String,
      required: true,
      enum: ["Question", "Comment"],
    },
    voteType: {
      type: String,
      required: true,
      enum: ["upvote", "downvote"],
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to prevent duplicate votes
voteSchema.index({ user: 1, target: 1, targetType: 1 }, { unique: true })

module.exports = mongoose.model("Vote", voteSchema)
