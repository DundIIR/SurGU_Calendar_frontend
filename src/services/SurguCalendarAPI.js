import axios from 'axios'
import CustomError from './CustomError'

class SurguCalendarAPI {
	// Метод для получения списка групп
	getGroups = async () => {
		try {
			const response = await axios.get('/api/group-list')
			if (!response.data || response.data.length === 0) {
				throw new CustomError('Группы не найдены; Попробуй обратиться в службу поддержки.')
			}

			return response.data
		} catch (error) {
			console.error(error)
			throw new CustomError('Ошибка запроса; Не удалось получить список групп.')
		}
	}

	// Метод для получения списка преподавателей
	getProfessors = async () => {
		try {
			const response = await axios.get('/api/professors-list/')

			if (!response.data || response.data.length === 0) {
				throw new CustomError('Преподаватели не найдены; Попробуй обратиться в службу поддержки.')
			}

			return response.data
		} catch (error) {
			console.error(error)
			throw new CustomError('Ошибка запроса; Не удалось получить список преподавателей.')
		}
	}

	// НЕ ИСПОЛЬЗУЕТСЯ
	// Метод для проверки существования группы или преподавателя
	getSearchCheck = async query => {
		try {
			const response = await axios.get(`/api/check?search=${query}`)

			if (!response.data || response.data.message) {
				const errorMessage = response.data && response.data.message ? response.data.message : 'Ничего не найдено по запросу.'
				throw new CustomError(`Ошибка; ${errorMessage}`)
			}

			return response.data
		} catch (error) {
			throw new CustomError('Ошибка запроса; Не удалось найти данные.')
		}
	}

	getScheduleFile = async (search, subgroup = null, professor = false) => {
		try {
			const response = await axios.get('/api/file-schedule/', {
				params: { search, subgroup, professors: professor.toString() },
			})

			if (!response.data || !response.data.file_url) {
				throw new CustomError('Файл не найден; Попробуй изменить запрос или обратись в поддержку.')
			}

			return response.data.file_url
		} catch (error) {
			console.error(error)
			throw new CustomError('Ошибка запроса; Попробуйте снова или обратитесь в поддержку.')
		}
	}

	getSchedule = async search => {
		try {
			const response = await axios.get('/api/schedule/', {
				params: { search },
			})

			if (!response.data || response.data.length === 0) {
				throw new CustomError('Расписание не найдено; Попробуй изменить запрос или обратись в поддержку.')
			}

			return response.data // Ожидаем, что бэкенд вернёт { group: "609-11", subgroups: ["A", "B"] }
		} catch (error) {
			console.error(error)
			throw new CustomError('Ошибка запроса; Попробуйте снова или обратитесь в поддержку.')
		}
	}

	updateUserRole = async (token, email, role) => {
		try {
			const response = await axios.post(
				'/api/update-role/',
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
			const response = await axios.get('/api/users/', {
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
			const response = await axios.get('/api/files/', {
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
			const response = await axios.get('/api/validate-token/', {
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
			let response = await axios.get('/api', {
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
