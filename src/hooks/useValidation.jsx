import { useState, useEffect } from 'react'
import SurguCalendarAPI from '../services/SurguCalendarAPI'

const useValidation = session => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const validateToken = async () => {
		if (!session?.access_token) {
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
		} finally {
			setLoading(false)
		}
	}

	// Автоматическая валидация при изменении сессии
	useEffect(() => {
		validateToken()
	}, [session])

	// Возвращаем состояние и функцию для ручной валидации
	return { user, loading, error, revalidate: validateToken }
}

export default useValidation
