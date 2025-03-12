import axios from 'axios'
import CustomError from './CustomError'

class SurguCalendarAPI {
	constructor(providerToken) {
		this.backendUrl = 'https://surgu-calendar.ru'
	}

	updateUserRole = async (token, email, role) => {
		try {
			const response = await axios.post(
				`${this.backendUrl}/api/update-role/`,
				{
					email: email,
					role: role,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			return response.data
		} catch (error) {
			console.error(error)
			if (error.response && error.response.status === 404) {
				throw new CustomError('Пользователь не найден; Проверьте введённый email.')
			} else if (error.response && error.response.status === 403) {
				throw new CustomError('Ошибка доступа; У вас недостаточно прав для изменения роли.')
			} else {
				throw new CustomError('Не удалось обновить роль; Обратитесь в службу поддержки.')
			}
		}
	}

	getUsersList = async token => {
		try {
			const response = await axios.get(`${this.backendUrl}/api/users/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			return response.data
		} catch (error) {
			console.error(error)
			throw new CustomError('Ошибка доступа; Недостаточно прав.')
		}
	}

	getFilesList = async token => {
		try {
			const response = await axios.get(`${this.backendUrl}/api/files/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			return response.data
		} catch (error) {
			console.error(error)
			throw new CustomError('Ошибка доступа; Недостаточно прав.')
		}
	}

	validateToken = async token => {
		try {
			const response = await axios.get(`${this.backendUrl}/api/validate-token/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			return response.data
		} catch (error) {
			console.error(error)
			throw new CustomError('Ошибка авторизации; Попробуйте снова войти в систему.')
		}
	}

	getSchedule = async search => {
		console.log(search)
		try {
			let response = await axios.get(`${this.backendUrl}/api`, {
				params: {
					search: search,
				},
			})

			console.log(response.data)

			return response.data
		} catch (error) {
			console.log(error)
			if (response && response.data && response.data.length < 1)
				throw new CustomError('Не получилось найти расписание;Попробуй изменить поисковый запрос или обратись в службу поддержки')
			else throw new CustomError('Сервер спит;Попробуй обратится в службу поддержки или зайти позже')
		}
	}
}

export default SurguCalendarAPI
