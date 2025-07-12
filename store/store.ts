import { configureStore } from "@reduxjs/toolkit"
import questionsReducer from "./questionsSlice"
import commentsReducer from "./commentsSlice"
import uiReducer from "./uiSlice"

export const store = configureStore({
  reducer: {
    questions: questionsReducer,
    comments: commentsReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
