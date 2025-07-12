import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Comment {
  id: string
  questionId: string
  parentId: string | null
  author: {
    name: string
    avatar: string
    reputation: number
  }
  content: string
  timestamp: string
  votes: number
  replies: Comment[]
}

interface CommentsState {
  comments: Comment[]
  loading: boolean
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
}

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      if (action.payload.parentId) {
        // Add as reply to existing comment
        const addReplyToComment = (comments: Comment[]): boolean => {
          for (const comment of comments) {
            if (comment.id === action.payload.parentId) {
              comment.replies.push(action.payload)
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
        state.comments.push(action.payload)
      }
    },
    updateCommentVotes: (state, action: PayloadAction<{ id: string; votes: number }>) => {
      const updateVotes = (comments: Comment[]) => {
        for (const comment of comments) {
          if (comment.id === action.payload.id) {
            comment.votes = action.payload.votes
            return
          }
          updateVotes(comment.replies)
        }
      }
      updateVotes(state.comments)
    },
  },
})

export const { setComments, addComment, updateCommentVotes } = commentsSlice.actions
export default commentsSlice.reducer
