const express = require("express");
const Question = require("../models/Question");
const User = require("../models/User");
const Comment = require("../models/Comment");
const { auth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// Get all questions with filters
router.get("/", optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tags,
      search,
      sort = "recent",
      filter = "all",
    } = req.query;

    const query = { isActive: true };

    // Apply filters
    if (category && category !== "all") {
      const categoryMap = {
        technology: "Technology",
        finance: "Finance",
        industry: "Industry",
        saas: "SaaS Products",
        "web-dev": "Web Development",
        "mobile-dev": "Mobile Development",
        "data-science": "Data Science",
        devops: "DevOps",
        design: "UI/UX Design",
        business: "Business",
        marketing: "Marketing",
        startups: "Startups",
        general: "General",
      };
      query.category = categoryMap[category] || category;
    }

    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Apply specific filters
    if (filter === "trending") {
      query.voteScore = { $gte: 5 };
    } else if (filter === "unanswered") {
      query.replies = 0;
    } else if (filter === "my-questions" && req.user) {
      query.author = req.user._id;
    }

    // Sorting
    let sortOption = {};
    switch (sort) {
      case "votes":
        sortOption = { voteScore: -1, createdAt: -1 };
        break;
      case "views":
        sortOption = { "views.count": -1, createdAt: -1 };
        break;
      case "activity":
        sortOption = { lastActivity: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const questions = await Question.find(query)
      .populate("author", "name username avatar reputation badges")
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Question.countDocuments(query);

    // Format questions for frontend
    const formattedQuestions = questions.map((question) => ({
      id: question._id,
      title: question.title,
      content:
        question.content.substring(0, 200) +
        (question.content.length > 200 ? "..." : ""),
      author: {
        id: question.author._id,
        name: question.author.name,
        avatar: question.author.avatar,
        badge:
          question.author.reputation > 1000
            ? "Expert"
            : question.author.reputation > 100
            ? "Member"
            : "New Participant",
        reputation: question.author.reputation,
      },
      category: question.category,
      tags: question.tags,
      votes: question.voteScore,
      replies: question.replies,
      views: question.views.count,
      timestamp: getTimeAgo(question.createdAt),
      hasAcceptedAnswer: question.hasAcceptedAnswer,
    }));

    res.json({
      questions: formattedQuestions,
      pagination: {
        current: Number.parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get questions error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single question
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("author", "name username avatar reputation badges")
      .populate("acceptedAnswer");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Add view if user is different from author
    if (!req.user || !req.user._id.equals(question.author._id)) {
      await question.addView(req.user?._id);
    }

    // Get related questions
    const relatedQuestions = await Question.find({
      _id: { $ne: question._id },
      $or: [{ tags: { $in: question.tags } }, { category: question.category }],
      isActive: true,
    })
      .populate("author", "name username avatar")
      .sort({ voteScore: -1 })
      .limit(5)
      .lean();

    const formattedQuestion = {
      id: question._id,
      title: question.title,
      content: question.content,
      author: {
        id: question.author._id,
        name: question.author.name,
        avatar: question.author.avatar,
        badge:
          question.author.reputation > 1000
            ? "Expert"
            : question.author.reputation > 100
            ? "Member"
            : "New Participant",
        reputation: question.author.reputation,
      },
      category: question.category,
      tags: question.tags,
      votes: question.voteScore,
      replies: question.replies,
      views: question.views.count,
      timestamp: getTimeAgo(question.createdAt),
      hasAcceptedAnswer: question.hasAcceptedAnswer,
      isSubscribed: req.user
        ? question.subscribers.includes(req.user._id)
        : false,
      isBookmarked: req.user
        ? question.bookmarkedBy.includes(req.user._id)
        : false,
      userVote: req.user ? getUserVote(question.votes, req.user._id) : null,
    };

    res.json({
      question: formattedQuestion,
      relatedQuestions: relatedQuestions.map((q) => ({
        id: q._id,
        title: q.title,
        category: q.category,
        hasAcceptedAnswer: q.hasAcceptedAnswer,
      })),
    });
  } catch (error) {
    console.error("Get question error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create question
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    const question = new Question({
      title,
      content,
      author: req.user._id,
      category,
      tags: tags.map((tag) => tag.toLowerCase()),
    });

    await question.save();
    await question.populate("author", "name username avatar reputation badges");

    // Update user's question count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { questionsCount: 1, reputation: 2 },
    });

    const formattedQuestion = {
      id: question._id,
      title: question.title,
      content: question.content,
      author: {
        id: question.author._id,
        name: question.author.name,
        avatar: question.author.avatar,
        badge:
          question.author.reputation > 1000
            ? "Expert"
            : question.author.reputation > 100
            ? "Member"
            : "New Participant",
        reputation: question.author.reputation,
      },
      category: question.category,
      tags: question.tags,
      votes: question.voteScore,
      replies: question.replies,
      views: question.views.count,
      timestamp: "just now",
      hasAcceptedAnswer: question.hasAcceptedAnswer,
    };

    res.status(201).json({ question: formattedQuestion });
  } catch (error) {
    console.error("Create question error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Subscribe to question
router.post("/:id/subscribe", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await question.subscribe(req.user._id);

    // Add to user's subscriptions
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { subscriptions: question._id },
    });

    res.json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Subscribe error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Unsubscribe from question
router.delete("/:id/subscribe", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await question.unsubscribe(req.user._id);

    // Remove from user's subscriptions
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { subscriptions: question._id },
    });

    res.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Bookmark question
router.post("/:id/bookmark", auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Add to question's bookmarkedBy
    await Question.findByIdAndUpdate(req.params.id, {
      $addToSet: { bookmarkedBy: req.user._id },
    });

    // Add to user's bookmarks
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { bookmarks: question._id },
    });

    res.json({ message: "Bookmarked successfully" });
  } catch (error) {
    console.error("Bookmark error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove bookmark
router.delete("/:id/bookmark", auth, async (req, res) => {
  try {
    // Remove from question's bookmarkedBy
    await Question.findByIdAndUpdate(req.params.id, {
      $pull: { bookmarkedBy: req.user._id },
    });

    // Remove from user's bookmarks
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { bookmarks: req.params.id },
    });

    res.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Remove bookmark error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper functions
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

function getUserVote(votes, userId) {
  if (votes.upvotes.some((vote) => vote.user.equals(userId))) return "upvote";
  if (votes.downvotes.some((vote) => vote.user.equals(userId)))
    return "downvote";
  return null;
}

module.exports = router;
