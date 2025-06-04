import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	groups: [],
	professors: [],
}

const apiSlice = createSlice({
	name: 'api',
	initialState,
	reducers: {
		setGroups(state, action) {
			state.groups = action.payload
		},
		setProfessors(state, action) {
			state.professors = action.payload
		},
	},
})

export const { setGroups, setProfessors } = apiSlice.actions

export default apiSlice.reducer
