import axios from 'axios'
import CustomError from './CustomError'

class SurguCalendarAPI {
	constructor(accessToken = '') {
		this.accessToken = accessToken
	}

	// Метод для получения списка групп
	getGroups = async () => {
		try {
			const response = await axios.get('/api/group-list/')
			if (!response.data || response.data.length === 0) {
				throw new CustomError('Группы не найдены; Попробуй обратиться в службу поддержки.')
			}

			return response.data
		} catch (error) {
			if (error.response) {
				// Ошибка от API
				throw new CustomError(error.response.data?.error || 'Ошибка запроса', {
					status: error.response.status,
					details: error.response.data?.details,
				})
			} else {
				// Сетевая ошибка
				throw new CustomError('Не удалось подключиться к серверу', {
					details: error,
				})
			}
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

	// Метода для получения занятий по группе, подгруппе или преподавателю
	getScheduleV2 = async (group = '', subgroup = '', professor = '', isChecked = false) => {
		try {
			const params = {}

			if (group) params.group = group
			if (subgroup) params.subgroup = subgroup
			if (professor) params.professor = professor
			if (isChecked) params.shorten_names = isChecked

			const response = await axios.get('/api/schedule/', {
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
					'Content-Type': 'application/json',
				},
				params: params,
			})

			if (!response.data.success) {
				throw new CustomError(response.data.error, {
					status: response.status,
					details: response.data.details,
				})
			}

			return response.data
		} catch (error) {
			if (error.response) {
				// Ошибка от API
				throw new CustomError(error.response.data?.error || 'Ошибка запроса', {
					status: error.response.status,
					details: error.response.data?.details,
				})
			} else {
				// Сетевая ошибка
				throw new CustomError('Не удалось подключиться к серверу', {
					details: error,
				})
			}
		}
	}

	// Метода для получения ссылки на скачивания файла с расписанием по группе, подгруппе или преподавателю
	getScheduleFile = async (group = '', subgroup = '', professor = '', isChecked = false) => {
		try {
			const params = {}

			if (group) params.group = group
			if (subgroup) params.subgroup = subgroup
			if (professor) params.professor = professor
			if (isChecked) params.shorten_names = isChecked

			const response = await axios.get('/api/file-schedule/', {
				headers: {
					Authorization: `Bearer ${this.accessToken}`,
					'Content-Type': 'application/json',
				},
				params: params,
			})

			if (!response.data.success) {
				throw new CustomError(response.data.error, {
					status: response.status,
					details: response.data.details,
				})
			}

			return response.data.results
		} catch (error) {
			if (error.response) {
				// Ошибка от API
				throw new CustomError(error.response.data?.error || 'Ошибка запроса', {
					status: error.response.status,
					details: error.response.data?.details,
				})
			} else {
				// Сетевая ошибка
				throw new CustomError('Не удалось подключиться к серверу', {
					details: error,
				})
			}
		}
	}

	validateToken = async token => {
		try {
			const response = await axios.get(`/api/validate-token/V2/`, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Cache-Control': 'no-cache, no-store, must-revalidate',
					Pragma: 'no-cache',
					Expires: '0',
				},
			})
			return response.data
		} catch (error) {
			if (error.response) {
				// Ошибка от API
				throw new CustomError(error.response.data?.error || 'Ошибка запроса', {
					status: error.response.status,
					details: error.response.data?.details,
				})
			} else {
				// Сетевая ошибка
				throw new CustomError('Не удалось подключиться к серверу', {
					details: error,
				})
			}
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
			if (error && error.data && error.data.length < 1)
				throw new CustomError('Не получилось найти расписание;Попробуй изменить поисковый запрос или обратись в службу поддержки')
			else throw new CustomError('Сервер спит;Попробуй обратится в службу поддержки или зайти позже')
		}
	}
}

export default SurguCalendarAPI
