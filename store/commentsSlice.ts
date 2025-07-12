import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { commentsAPI, votesAPI } from "@/lib/api"

export interface Comment {
  id: string
  questionId: string
  parentId: string | null
  author: {
    id: string
    name: string
    avatar: string
    reputation: number
  }
  content: string
  timestamp: string
  votes: number
  replies: Comment[]
  isAccepted: boolean
  userVote?: "upvote" | "downvote" | null
  createdAt: string
  updatedAt: string
}

interface CommentsState {
  comments: Comment[]
  loading: boolean
  error: string | null
  submitting: boolean
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
  submitting: false,
}

// Async thunks for API calls
export const fetchComments = createAsyncThunk("comments/fetchComments", async (questionId: string) => {
  // console.log("Fetching comments for question ID:", questionId)
  const response = await commentsAPI.getComments(questionId)
  // console.log("Fetched comments:", response)
  return response.data
})

export const createComment = createAsyncThunk(
  "comments/createComment",
  async (commentData: {
    content: string
    questionId: string
    parentCommentId?: string
  }) => {
    const response = await commentsAPI.createComment(commentData)
    return response.data
  },
)

export const voteOnComment = createAsyncThunk(
  "comments/voteOnComment",
  async (voteData: {
    commentId: string
    voteType: "upvote" | "downvote"
  }) => {
    const response = await votesAPI.vote({
      targetId: voteData.commentId,
      targetType: "Comment",
      voteType: voteData.voteType,
    })
    return { commentId: voteData.commentId, ...response.data }
  },
)

export const acceptAnswer = createAsyncThunk("comments/acceptAnswer", async (commentId: string) => {
  const response = await commentsAPI.acceptAnswer(commentId)
  return { commentId, ...response.data }
})

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async (updateData: {
    commentId: string
    content: string
  }) => {
    const response = await commentsAPI.updateComment(updateData.commentId, {
      content: updateData.content,
    })
    return response.data
  },
)

export const deleteComment = createAsyncThunk("comments/deleteComment", async (commentId: string) => {
  await commentsAPI.deleteComment(commentId)
  return commentId
})

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = []
    },
    clearError: (state) => {
      state.error = null
    },
    updateCommentInList: (state, action: PayloadAction<Partial<Comment> & { id: string }>) => {
      const updateCommentRecursively = (comments: Comment[]): boolean => {
        for (let i = 0; i < comments.length; i++) {
          if (comments[i].id === action.payload.id) {
            comments[i] = { ...comments[i], ...action.payload }
            return true
          }
          if (comments[i].replies && updateCommentRecursively(comments[i].replies)) {
            return true
          }
        }
        return false
      }
      updateCommentRecursively(state.comments)
    },
  },
  extraReducers: (builder) => {
    // Fetch Comments
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false
        state.comments = action.payload.comments
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch comments"
      })

    // Create Comment
    builder
      .addCase(createComment.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.submitting = false
        const newComment = action.payload.comment

        if (newComment.parentId) {
          // Add as reply to existing comment
          const addReplyToComment = (comments: Comment[]): boolean => {
            for (const comment of comments) {
              if (comment.id === newComment.parentId) {
                comment.replies.push(newComment)
                return true
              }
              if (addReplyToComment(comment.replies)) {
                return true
              }
            }
            return false
          }
          addReplyToComment(state.comments)
        } else {
          // Add as top-level comment
          state.comments.push(newComment)
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.submitting = false
        state.error = action.error.message || "Failed to create comment"
      })

    // Vote on Comment
    builder.addCase(voteOnComment.fulfilled, (state, action) => {
      const { commentId, voteScore, userVote } = action.payload

      const updateVoteRecursively = (comments: Comment[]): boolean => {
        for (let i = 0; i < comments.length; i++) {
          if (comments[i].id === commentId) {
            comments[i].votes = voteScore
            comments[i].userVote = userVote
            return true
          }
          if (comments[i].replies && updateVoteRecursively(comments[i].replies)) {
            return true
          }
        }
        return false
      }
      updateVoteRecursively(state.comments)
    })

    // Accept Answer
    builder.addCase(acceptAnswer.fulfilled, (state, action) => {
      const { commentId } = action.payload

      // First, unaccept all other answers
      const unacceptAllAnswers = (comments: Comment[]) => {
        comments.forEach((comment) => {
          comment.isAccepted = false
          unacceptAllAnswers(comment.replies)
        })
      }
      unacceptAllAnswers(state.comments)

      // Then accept the selected answer
      const acceptCommentRecursively = (comments: Comment[]): boolean => {
        for (let i = 0; i < comments.length; i++) {
          if (comments[i].id === commentId) {
            comments[i].isAccepted = true
            return true
          }
          if (comments[i].replies && acceptCommentRecursively(comments[i].replies)) {
            return true
          }
        }
        return false
      }
      acceptCommentRecursively(state.comments)
    })

    // Update Comment
    builder.addCase(updateComment.fulfilled, (state, action) => {
      const updatedComment = action.payload.comment

      const updateCommentRecursively = (comments: Comment[]): boolean => {
        for (let i = 0; i < comments.length; i++) {
          if (comments[i].id === updatedComment.id) {
            comments[i] = { ...comments[i], ...updatedComment }
            return true
          }
          if (comments[i].replies && updateCommentRecursively(comments[i].replies)) {
            return true
          }
        }
        return false
      }
      updateCommentRecursively(state.comments)
    })

    // Delete Comment
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      const commentId = action.payload

      const deleteCommentRecursively = (comments: Comment[]): Comment[] => {
        return comments.filter((comment) => {
          if (comment.id === commentId) {
            return false
          }
          comment.replies = deleteCommentRecursively(comment.replies)
          return true
        })
      }
      state.comments = deleteCommentRecursively(state.comments)
    })
  },
})

export const { clearComments, clearError, updateCommentInList } = commentsSlice.actions

export default commentsSlice.reducer
