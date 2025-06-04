import axios from 'axios'
import SurguCalendarAPI from './SurguCalendarAPI'
import CustomError from './CustomError'

class GoogleCalendarAPI {
	constructor(providerToken) {
		this.providerToken = providerToken
		this.calendarBaseUrl = 'https://www.googleapis.com/calendar/v3'
		this.timeZone = 'Asia/Yekaterinburg'
		this.totalEvents = 0
		this.importedEvents = 0
	}

	async createCalendar(summary) {
		try {
			console.log('календарь начал создаваться')
			const response = await axios.post(
				`${this.calendarBaseUrl}/calendars`,
				{ summary, timeZone: this.timeZone },
				{
					headers: {
						Authorization: `Bearer ${this.providerToken}`,
						'Content-Type': 'application/json',
					},
				},
			)

			// console.log(response.data)
			console.log('Календарь создан')
			return response.data
		} catch (error) {
			console.error('Ошибка при создании календаря: ', error)
			throw new CustomError('Не получилось создать календарь;Попробуй обратиться в службу поддержки')
		}
	}

	async createEvent(calendarId, event, setProgress) {
		try {
			const response = await axios.post(`${this.calendarBaseUrl}/calendars/${calendarId}/events`, event, {
				headers: {
					Authorization: `Bearer ${this.providerToken}`,
					'Content-Type': 'application/json',
				},
			})

			// console.log(response.data)
			const progressPercentage = Math.floor((++this.importedEvents / this.totalEvents) * 100)
			setProgress(progressPercentage)
			if (this.importedEvents == this.totalEvents) {
				setTimeout(() => {
					setProgress(0)
				}, 2000)
			}
			console.log('Событие создано')
			return response.data
		} catch (error) {
			console.error('Ошибка при создании события: ', error)
			throw new CustomError('Не получилось создать событие;Попробуй обратиться в службу поддержки')
		}
	}

	async importSchedule(search, setProgress, setError) {
		try {
			const surguCalendarAPI = new SurguCalendarAPI()
			const schedule = await surguCalendarAPI.getSchedule(search)
			this.totalEvents = schedule.length
			console.log('запрос корректный')
			if (schedule && schedule.length > 0) {
				console.log('расписание получено')
				const calendar = await this.createCalendar(search)

				if (calendar && calendar.id) {
					let summary = ''
					let colorId = 0

					for (const lesson of schedule) {
						const start = this.formatDateTime(lesson.datetime_start_lesson)
						const end = this.formatDateTime(lesson.datetime_end_lesson)
						const until = lesson.repetition
						const interval = lesson.interval ? `;INTERVAL=${lesson.interval}` : ''
						if (lesson.summary != summary) {
							summary = lesson.summary
							colorId = colorId === 12 ? 0 : colorId + 1
						}

						const event = {
							summary: lesson.summary,
							location: lesson.location,
							description: lesson.description,
							colorId: colorId,
							start: {
								dateTime: start,
								timeZone: this.timeZone,
							},
							end: {
								dateTime: end,
								timeZone: this.timeZone,
							},
							recurrence: [`RRULE:FREQ=WEEKLY;UNTIL=${until}${interval}`],
						}

						await this.createEvent(calendar.id, event, setProgress)
					}
				} else {
					console.log(calendar)
					throw new CustomError('Не получилось создать новый календарь;Попробуй обратиться в службу поддержки')
				}
			} else {
				console.log(schedule)
				throw new CustomError('Не получилось найти расписание;Попробуй изменить поисковый запрос или обратись в службу поддержки')
			}
		} catch (error) {
			console.log('Ошибка при импорте расписания: ', error)
			setError(error.errorFormat)
		}
	}

	formatDateTime(dateTime) {
		try {
			return (
				`${dateTime.substring(0, 4)}-${dateTime.substring(4, 6)}-${dateTime.substring(6, 8)}T` +
				`${dateTime.substring(9, 11)}:${dateTime.substring(11, 13)}:${dateTime.substring(13, 15)}`
			)
		} catch (error) {
			console.log('Ошибка в полученных данных: ', dateTime)
			throw new CustomError('Получены плохие данные от сервера;Попробуй обратиться в службу поддержки или зайти позже')
		}
	}
}

export default GoogleCalendarAPI
