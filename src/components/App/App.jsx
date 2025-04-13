import { Route, Routes, Navigate } from 'react-router-dom'
import { DefaultPage, HomePage, AdminPage } from '../../pages'
import { useEffect, useState } from 'react'
import { useSession, useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react'
import SurguCalendarAPI from '../../services/SurguCalendarAPI'
import useValidation from '../../hooks/useValidation'
import { Flex, Spinner, Text } from '@chakra-ui/react'

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
		}
	}, [user])

	if (isLoading) {
		return (
			<Flex direction="column" alignItems="center" justifyContent="center" height="100%" gap={4} overflow="hidden">
				<Spinner thickness="4px" speed="0.65s" size={{ base: 'lg', md: 'lg', lg: 'xl' }} />
				<Text fontSize={'lg'} color="gray.600" textAlign={'center'}>
					Пожалуйста, подождите... Идёт проверка данных
				</Text>
			</Flex>
		)
	}

	return (
		<Routes>
			<Route
				path="/"
				element={session ? role === 'Администратор' ? <Navigate to="/admin" /> : <Navigate to="/home" /> : <DefaultPage />}
			/>
			<Route path="/home" element={session ? <HomePage /> : <Navigate to="/" />} />
			<Route path="/admin" element={session && role === 'Администратор' ? <AdminPage /> : <Navigate to="/home" />} />
		</Routes>
	)
}

export default App
