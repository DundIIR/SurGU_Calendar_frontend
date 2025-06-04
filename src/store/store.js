import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './searchSlice'
import apiReducer from './reducer'

export const store = configureStore({
	reducer: {
		search: searchReducer,
		api: apiReducer,
	},
})
