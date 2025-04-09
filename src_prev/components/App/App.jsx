import { Route, Routes, Navigate } from 'react-router-dom'
import { DefaultPage, HomePage, AdminPage } from '../../pages'
import { useEffect, useState } from 'react'
import { useSession, useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react'
import SurguCalendarAPI from '../../services/SurguCalendarAPI'

const App = () => {
	const session = useSession()
	const { isLoading } = useSessionContext()
	const [role, setRole] = useState(null)
	const [isRoleLoading, setIsRoleLoading] = useState(true)
	const [searches, setSearches] = useState([])

	const updateSchedule = () => {
		const storedSearches = JSON.parse(localStorage.getItem('searches')) || []
		setSearches(storedSearches)
	}

	useEffect(() => {
		updateSchedule()
	}, [])

	useEffect(() => {
		const validateUserRole = async () => {
			if (session) {
				try {
					const surguCalendarAPI = new SurguCalendarAPI()
					const data = await surguCalendarAPI.validateToken(session.access_token)
					setRole(data.user.role)
					console.log(data.user.role)
				} catch (error) {
					console.error('Ошибка валидации токена:', error)
				} finally {
					setIsRoleLoading(false)
				}
			} else {
				setIsRoleLoading(false)
			}
		}
		validateUserRole()
	}, [session])

	// if (isLoading || isRoleLoading || role === null) {
	// 	return 'Загрузка'
	// }

	return (
		<Routes>
			<Route
				path="/"
				element={
					session ? (
						role === 'Администратор' ? (
							<Navigate to="/admin" />
						) : (
							<Navigate to="/home" />
						)
					) : (
						<DefaultPage updateSchedule={updateSchedule} searches={searches} setSearches={setSearches} />
					)
				}
			/>
			<Route
				path="/home"
				element={
					session ? (
						<HomePage updateSchedule={updateSchedule} searches={searches} setSearches={setSearches} />
					) : (
						<Navigate to="/" />
					)
				}
			/>
			<Route path="/admin" element={session && role === 'Администратор' ? <AdminPage /> : <Navigate to="/home" />} />
		</Routes>
	)
}

export default App
