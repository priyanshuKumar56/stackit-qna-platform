const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    votes: {
      upvotes: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      downvotes: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
    voteScore: {
      type: Number,
      default: 0,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editHistory: [
      {
        content: String,
        editedAt: { type: Date, default: Date.now },
        editedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Indexes
commentSchema.index({ question: 1 })
commentSchema.index({ author: 1 })
commentSchema.index({ parentComment: 1 })
commentSchema.index({ voteScore: -1 })
commentSchema.index({ createdAt: -1 })

// Update vote score when votes change
commentSchema.pre("save", function (next) {
  this.voteScore = this.votes.upvotes.length - this.votes.downvotes.length
  next()
})

// Method to accept answer
commentSchema.methods.acceptAnswer = async function () {
  const Question = mongoose.model("Question")

  // Mark this comment as accepted
  this.isAccepted = true
  await this.save()

  // Update the question
  await Question.findByIdAndUpdate(this.question, {
    hasAcceptedAnswer: true,
    acceptedAnswer: this._id,
  })

  // Give reputation to the answer author
  const User = mongoose.model("User")
  await User.findByIdAndUpdate(this.author, {
    $inc: { reputation: 15, answersCount: 1 },
  })

  return this
}

module.exports = mongoose.model("Comment", commentSchema)
