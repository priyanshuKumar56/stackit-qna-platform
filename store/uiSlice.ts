import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UIState {
  sidebarCollapsed: boolean
  activeTab: string
  isQuestionModalOpen: boolean
  searchQuery: string
}

const initialState: UIState = {
  sidebarCollapsed: false,
  activeTab: "recent-activity",
  isQuestionModalOpen: false,
  searchQuery: "",
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload
    },
    setQuestionModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isQuestionModalOpen = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
  },
})

export const { toggleSidebar, setActiveTab, setQuestionModalOpen, setSearchQuery } = uiSlice.actions
export default uiSlice.reducer
