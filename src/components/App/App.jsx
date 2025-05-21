import { Route, Routes, Navigate } from 'react-router-dom'
import { DefaultPage, HomePage, AdminPage, LoadPage } from '../../pages'
import { useEffect, useState } from 'react'
import { useSession, useSessionContext } from '@supabase/auth-helpers-react'
import useValidation from '../../hooks/useValidation'

const App = () => {
	const session = useSession()
	const { isLoading } = useSessionContext()
	const [role, setRole] = useState(null)
	const [isRoleLoading, setIsRoleLoading] = useState(true)
	const [searches, setSearches] = useState([])
	const { user, loading, error } = useValidation(session)

	const updateSchedule = () => {
		const storedSearches = JSON.parse(localStorage.getItem('searches')) || []
		setSearches(storedSearches)
	}

	useEffect(() => {
		updateSchedule()
	}, [])

	useEffect(() => {
		if (user) {
			setRole(user.role)
			setIsRoleLoading(false)
		}
	}, [user])

	if (isLoading || isRoleLoading) {
		return <LoadPage />
	}

	return (
		<Routes>
			<Route path="/" element={session ? <Navigate to={role === 'Администратор' ? '/admin' : '/home'} /> : <DefaultPage />} />
			<Route
				path="/admin"
				element={session ? role === 'Администратор' ? <AdminPage /> : <Navigate to="/home" /> : <Navigate to="/" />}
			/>
			<Route
				path="/home"
				element={session ? role === 'Администратор' ? <Navigate to="/admin" /> : <HomePage /> : <Navigate to="/" />}
			/>
		</Routes>
		// 	<Route path="/" element={session ? <Navigate to={'/admin'} /> : <DefaultPage />} />
	)
}

export default App
