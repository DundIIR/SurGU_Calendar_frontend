export default class CustomError extends Error {
	constructor(message, { cause, status, details } = {}) {
		// Форматируем сообщение для родительского класса
		const formattedMessage = typeof message === 'string' ? message : 'Произошла ошибка'

		super(formattedMessage)

		// Сохраняем оригинальную причину ошибки
		if (cause) this.cause = cause

		// Добавляем статус ошибки (для HTTP ошибок)
		this.status = status || 500

		// Детализированная информация об ошибке
		this.details = details || this._parseDetails(message)

		// Автоматическое форматирование для UI
		this.ui = this._formatForUI(message)
	}

	// Парсинг деталей из разных форматов сообщений
	_parseDetails(message) {
		if (typeof message === 'object') return message
		if (message.includes(';')) {
			const [title, description] = message.split(';')
			return { title: title.trim(), description: description?.trim() }
		}
		return { title: message, description: '' }
	}

	// Форматирование для отображения в интерфейсе
	_formatForUI(message) {
		if (typeof message === 'object') {
			return {
				title: message.title || 'Ошибка',
				description: message.description || '',
			}
		}

		const defaultTitle = 'Произошла ошибка'
		const defaultDescription = 'Попробуйте повторить действие позже'

		if (message.includes(';')) {
			const [title, description] = message.split(';')
			return {
				title: title.trim() || defaultTitle,
				description: description?.trim() || defaultDescription,
			}
		}

		return {
			title: message || defaultTitle,
			description: defaultDescription,
		}
	}

	// Метод для логирования ошибки
	log() {
		console.error(`[CustomError] ${this.message}`, {
			status: this.status,
			details: this.details,
			cause: this.cause,
			stack: this.stack,
		})
	}
}
