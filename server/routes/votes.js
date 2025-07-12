const express = require("express")
const Vote = require("../models/Vote")
const Question = require("../models/Question")
const Comment = require("../models/Comment")
const User = require("../models/User")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Vote on question or comment
router.post("/", auth, async (req, res) => {
  try {
    const { targetId, targetType, voteType } = req.body

    // Check if user already voted
    const existingVote = await Vote.findOne({
      user: req.user._id,
      target: targetId,
      targetType,
    })

    const Model = targetType === "Question" ? Question : Comment
    const target = await Model.findById(targetId)

    if (!target) {
      return res.status(404).json({ message: `${targetType} not found` })
    }

    // Prevent self-voting
    if (target.author.equals(req.user._id)) {
      return res.status(400).json({ message: "Cannot vote on your own content" })
    }

    let reputationChange = 0
    let voteChange = 0

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Remove vote
        await Vote.findByIdAndDelete(existingVote._id)

        // Remove from target's votes
        if (voteType === "upvote") {
          target.votes.upvotes = target.votes.upvotes.filter((vote) => !vote.user.equals(req.user._id))
          reputationChange = targetType === "Question" ? -5 : -10
          voteChange = -1
        } else {
          target.votes.downvotes = target.votes.downvotes.filter((vote) => !vote.user.equals(req.user._id))
          reputationChange = targetType === "Question" ? 2 : 2
          voteChange = 1
        }

        await target.save()

        // Update author's reputation
        await User.findByIdAndUpdate(target.author, {
          $inc: { reputation: reputationChange, votesReceived: voteChange },
        })

        res.json({
          message: "Vote removed",
          voteScore: target.voteScore,
          userVote: null,
        })
      } else {
        // Change vote type
        existingVote.voteType = voteType
        await existingVote.save()

        // Update target's votes
        if (voteType === "upvote") {
          // Remove from downvotes, add to upvotes
          target.votes.downvotes = target.votes.downvotes.filter((vote) => !vote.user.equals(req.user._id))
          target.votes.upvotes.push({ user: req.user._id })
          reputationChange = targetType === "Question" ? 7 : 12 // +5/-10 for upvote, +2 for removing downvote
          voteChange = 2
        } else {
          // Remove from upvotes, add to downvotes
          target.votes.upvotes = target.votes.upvotes.filter((vote) => !vote.user.equals(req.user._id))
          target.votes.downvotes.push({ user: req.user._id })
          reputationChange = targetType === "Question" ? -7 : -12 // -5/+10 for removing upvote, -2 for downvote
          voteChange = -2
        }

        await target.save()

        // Update author's reputation
        await User.findByIdAndUpdate(target.author, {
          $inc: { reputation: reputationChange, votesReceived: voteChange },
        })

        res.json({
          message: "Vote updated",
          voteScore: target.voteScore,
          userVote: voteType,
        })
      }
    } else {
      // Create new vote
      const newVote = new Vote({
        user: req.user._id,
        target: targetId,
        targetType,
        voteType,
      })

      await newVote.save()

      // Add to target's votes
      if (voteType === "upvote") {
        target.votes.upvotes.push({ user: req.user._id })
        reputationChange = targetType === "Question" ? 5 : 10
        voteChange = 1
      } else {
        target.votes.downvotes.push({ user: req.user._id })
        reputationChange = targetType === "Question" ? -2 : -2
        voteChange = -1
      }

      await target.save()

      // Update author's reputation
      await User.findByIdAndUpdate(target.author, {
        $inc: { reputation: reputationChange, votesReceived: voteChange },
      })

      res.json({
        message: "Vote added",
        voteScore: target.voteScore,
        userVote: voteType,
      })
    }
  } catch (error) {
    console.error("Vote error:", error)
    if (error.code === 11000) {
      res.status(400).json({ message: "Duplicate vote error" })
    } else {
      res.status(500).json({ message: "Server error" })
    }
  }
})

// Get user's vote on a target
router.get("/:targetType/:targetId", auth, async (req, res) => {
  try {
    const { targetType, targetId } = req.params

    const vote = await Vote.findOne({
      user: req.user._id,
      target: targetId,
      targetType,
    })

    res.json({ userVote: vote ? vote.voteType : null })
  } catch (error) {
    console.error("Get vote error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
