const express = require("express");
const User = require("../models/User");
const Question = require("../models/Question");
const Comment = require("../models/Comment");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Get user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's questions
    const questions = await Question.find({ author: user._id, isActive: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Get user's answers
    const answers = await Comment.find({
      author: user._id,
      parentComment: null,
    })
      .populate("question", "title")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const userProfile = {
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
      joinDate: user.createdAt,
      questions: questions.map((q) => ({
        id: q._id,
        title: q.title,
        votes: q.voteScore,
        replies: q.replies,
        views: q.views.count,
        timestamp: q.createdAt,
        hasAcceptedAnswer: q.hasAcceptedAnswer,
      })),
      answers: answers.map((a) => ({
        id: a._id,
        content: a.content.substring(0, 100) + "...",
        questionTitle: a.question.title,
        votes: a.voteScore,
        timestamp: a.createdAt,
        isAccepted: a.isAccepted,
      })),
    };

    res.json({ user: userProfile });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, bio, location, website } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, location, website },
      { new: true }
    ).select("-password");

    res.json({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        location: updatedUser.location,
        website: updatedUser.website,
        avatar: updatedUser.avatar,
        reputation: updatedUser.reputation,
        badges: updatedUser.badges,
        questionsCount: updatedUser.questionsCount,
        answersCount: updatedUser.answersCount,
        votesReceived: updatedUser.votesReceived,
        viewsCount: updatedUser.viewsCount,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get leaderboard
router.get("/leaderboard/top", async (req, res) => {
  try {
    const { type = "reputation", limit = 10 } = req.query;

    let sortField = {};
    switch (type) {
      case "reputation":
        sortField = { reputation: -1 };
        break;
      case "questions":
        sortField = { questionsCount: -1 };
        break;
      case "answers":
        sortField = { answersCount: -1 };
        break;
      default:
        sortField = { reputation: -1 };
    }

    const users = await User.find()
      .select(
        "name username avatar reputation badges questionsCount answersCount votesReceived"
      )
      .sort(sortField)
      .limit(Number.parseInt(limit));

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user._id,
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      reputation: user.reputation,
      badges: user.badges,
      questionsCount: user.questionsCount,
      answersCount: user.answersCount,
      votesReceived: user.votesReceived,
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
