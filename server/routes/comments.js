const express = require("express")
const Comment = require("../models/Comment")
const Question = require("../models/Question")
const User = require("../models/User")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Get comments for a question
router.get("/question/:questionId", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const comments = await Comment.find({
      question: req.params.questionId,
      parentComment: null,
    })
      .populate("author", "name username avatar reputation")
      .populate({
        path: "replies",
        populate: {
          path: "author",
          select: "name username avatar reputation",
        },
      })
      .sort({ voteScore: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Comment.countDocuments({
      question: req.params.questionId,
      parentComment: null,
    })

    const formattedComments = comments.map((comment) => ({
      id: comment._id,
      content: comment.content,
      author: {
        id: comment.author._id,
        name: comment.author.name,
        avatar: comment.author.avatar,
        reputation: comment.author.reputation,
      },
      votes: comment.voteScore,
      timestamp: getTimeAgo(comment.createdAt),
      isAccepted: comment.isAccepted,
      replies: comment.replies.map((reply) => ({
        id: reply._id,
        content: reply.content,
        author: {
          id: reply.author._id,
          name: reply.author.name,
          avatar: reply.author.avatar,
          reputation: reply.author.reputation,
        },
        votes: reply.voteScore,
        timestamp: getTimeAgo(reply.createdAt),
      })),
    }))

    res.json({
      comments: formattedComments,
      pagination: {
        current: Number.parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error) {
    console.error("Get comments error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create comment
router.post("/", auth, async (req, res) => {
  try {
    const { content, questionId, parentCommentId } = req.body

    const comment = new Comment({
      content,
      author: req.user._id,
      question: questionId,
      parentComment: parentCommentId || null,
    })

    await comment.save()
    await comment.populate("author", "name username avatar reputation")

    // Update question's reply count and last activity
    await Question.findByIdAndUpdate(questionId, {
      $inc: { replies: 1 },
      lastActivity: new Date(),
    })

    // If it's a reply, add to parent comment's replies
    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id },
      })
    }

    // Update user's answer count and reputation
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { answersCount: 1, reputation: 1 },
    })

    // Notify question subscribers
    const question = await Question.findById(questionId).populate("subscribers", "name email")
    if (question.subscribers.length > 0) {
      // Emit socket event for real-time notifications
      req.io.to(`question-${questionId}`).emit("new-comment", {
        comment: {
          id: comment._id,
          content: comment.content,
          author: {
            id: comment.author._id,
            name: comment.author.name,
            avatar: comment.author.avatar,
            reputation: comment.author.reputation,
          },
          votes: comment.voteScore,
          timestamp: "just now",
          isAccepted: comment.isAccepted,
        },
      })
    }

    const formattedComment = {
      id: comment._id,
      content: comment.content,
      author: {
        id: comment.author._id,
        name: comment.author.name,
        avatar: comment.author.avatar,
        reputation: comment.author.reputation,
      },
      votes: comment.voteScore,
      timestamp: "just now",
      isAccepted: comment.isAccepted,
      replies: [],
    }

    res.status(201).json({ comment: formattedComment })
  } catch (error) {
    console.error("Create comment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Accept answer
router.post("/:id/accept", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate("question")

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }

    // Check if user is the question author
    if (!comment.question.author.equals(req.user._id)) {
      return res.status(403).json({ message: "Only question author can accept answers" })
    }

    // Unaccept previous accepted answer if exists
    if (comment.question.hasAcceptedAnswer) {
      await Comment.findByIdAndUpdate(comment.question.acceptedAnswer, {
        isAccepted: false,
      })
    }

    // Accept this answer
    await comment.acceptAnswer()

    res.json({ message: "Answer accepted successfully" })
  } catch (error) {
    console.error("Accept answer error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

function getTimeAgo(date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

module.exports = router
