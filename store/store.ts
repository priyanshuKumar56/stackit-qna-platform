import { configureStore } from "@reduxjs/toolkit"
import questionsReducer from "./questionsSlice"
import commentsReducer from "./commentsSlice"
import uiReducer from "./uiSlice"
import usersReducer from "./usersSlice" // Import usersReducer

export const store = configureStore({
  reducer: {
    questions: questionsReducer,
    comments: commentsReducer,
    ui: uiReducer,
    users: usersReducer, // Add usersReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
