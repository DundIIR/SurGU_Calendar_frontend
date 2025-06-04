import { useState, useEffect, useCallback } from 'react'
import SurguCalendarAPI from '../services/SurguCalendarAPI'

const useValidation = session => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const validateToken = useCallback(async () => {
		// Если сессии нет, сбрасываем пользователя
		if (!session) {
			setUser(null)
			setLoading(false)
			return
		}

		// Если есть сессия, но нет токена, тоже сбрасываем
		if (!session.access_token) {
			setUser(null)
			setLoading(false)
			return
		}

		try {
			setLoading(true)
			const api = new SurguCalendarAPI()
			const data = await api.validateToken(session.access_token)
			setUser(data.user)
			setError(null)
		} catch (err) {
			console.error('Ошибка валидации токена:', err)
			setError(err)
			setUser(null)
		} finally {
			setLoading(false)
		}
	}, [session])

	useEffect(() => {
		validateToken()
	}, [validateToken])

	return { user, loading, error, revalidate: validateToken }
}

export default useValidation
