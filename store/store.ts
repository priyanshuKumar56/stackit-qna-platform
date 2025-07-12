import { configureStore } from "@reduxjs/toolkit"
import questionsReducer from "./questionsSlice"
import commentsReducer from "./commentsSlice"
import uiReducer from "./uiSlice"
import usersReducer from "./usersSlice"

export const store = configureStore({
  reducer: {
    questions: questionsReducer,
    comments: commentsReducer,
    ui: uiReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
