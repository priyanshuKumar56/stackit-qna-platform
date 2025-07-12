const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Technology",
        "Finance",
        "Industry",
        "SaaS Products",
        "Web Development",
        "Mobile Development",
        "Data Science",
        "DevOps",
        "UI/UX Design",
        "Business",
        "Marketing",
        "Startups",
        "General",
      ],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
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
    views: {
      count: { type: Number, default: 0 },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    replies: {
      type: Number,
      default: 0,
    },
    hasAcceptedAnswer: {
      type: Boolean,
      default: false,
    },
    acceptedAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    subscribers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bookmarkedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
questionSchema.index({ author: 1 });
questionSchema.index({ category: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ voteScore: -1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ lastActivity: -1 });
questionSchema.index({ "views.count": -1 });

// Virtual for net vote score
questionSchema.virtual("netVotes").get(function () {
  return this.votes.upvotes.length - this.votes.downvotes.length;
});

// Update vote score when votes change
questionSchema.pre("save", function (next) {
  this.voteScore = this.votes.upvotes.length - this.votes.downvotes.length;
  next();
});

// Method to add view
questionSchema.methods.addView = function (userId) {
  if (userId && !this.views.users.includes(userId)) {
    this.views.users.push(userId);
  }
  this.views.count += 1;
  return this.save();
};

// Method to subscribe user
questionSchema.methods.subscribe = function (userId) {
  if (!this.subscribers.includes(userId)) {
    this.subscribers.push(userId);
  }
  return this.save();
};

// Method to unsubscribe user
questionSchema.methods.unsubscribe = function (userId) {
  this.subscribers = this.subscribers.filter((id) => !id.equals(userId));
  return this.save();
};

module.exports = mongoose.model("Question", questionSchema);
