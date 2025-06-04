import {
	Drawer,
	DrawerOverlay,
	DrawerContent,
	Stack,
	RadioGroup,
	Spinner,
	useToast,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalFooter,
	Button,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import closeIcon from '../../../img/close.svg'
import errorIcon from '../../../img/error.svg'
import './_bottom-sheet.scss'
import { useSelector } from 'react-redux'
import SurguCalendarAPI from '../../../services/SurguCalendarAPI'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import GoogleCalendarAPI from '../../../services/GoogleCalendarAPI'

// Функция для нормализации поискового запроса
// Разбивает запрос на номер группы и подгруппу (если есть)
const normalizeSearchQuery = query => {
	if (query.match(/^[а-яa-z]/i)) {
		return {
			group: null,
			subgroup: null,
			professor: query,
		}
	}

	const match = query.match(/^([0-9\-]+)([а-я])?$/i)

	return {
		group: match ? match[1] : query, // Основная часть (без буквы)
		subgroup: match && match[2] ? match[2] : null, // Последняя буква или null
		professor: null,
	}
}

const reductionFIO = professor => {
	return professor
		?.split(' ')
		.map((item, i) => (i >= 1 ? `${item[0]}.` : item))
		.join(' ')
}

const BottomSheet = ({ isOpen, onClose, searchQuery, loadingData }) => {
	const supabase = useSupabaseClient() // Клиент Supabase
	const session = useSession() // Получение текущей сессии

	const query = normalizeSearchQuery(searchQuery) // Нормализация поискового запроса
	const groups = useSelector(state => state.api.groups) // Получение данных групп из Redux store
	const professors = useSelector(state => state.api.professors) // Получение преподавателей из Redux store

	const toast = useToast() // Хук для тостов

	const [subgroupValue, setSubgroupValue] = useState('0') // Подгруппа выбранная из радио-группы
	const [subgroupOptions, setSubgroupOptions] = useState([{ value: '0', label: 'Вся группа' }]) // Перечисление подгрупп для радио-группы
	const [isChecked, setIsChecked] = useState(true) // Состояние чекбокса

	// Состояние для модалки
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [firstTimeUser, setFirstTimeUser] = useState(Boolean(localStorage.getItem('modal_shown'))) // Флаг первичного открытия модалки

	// Состояния для отображения прогресса загрузки
	const [loadingStatus, setLoadingStatus] = useState('Ищем расписание') // Статус загрузки
	const [notFound, setNotFound] = useState(false) // Флаг "не найдено"
	const [loading, setLoading] = useState(loadingData) // Флаг "идет загрузка"

	// 1. Функция входа через Google
	const googleSignIn = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					scopes: 'https://www.googleapis.com/auth/calendar',
					redirectTo: window.location.origin,
				},
			})
			if (error) throw error
		} catch (error) {
			toast({
				title: 'Ошибка входа',
				description: error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
			})
		}
	}

	// 2. Эффект при открытии модалки или изменении запроса
	useEffect(() => {
		if (!isOpen) {
			// Сброс состояний при закрытии
			setSubgroupValue('0')
			setNotFound(false)
			setIsChecked(true)
			setLoadingStatus('Ищем расписание')
			setSubgroupOptions([{ value: '0', label: 'Всё расписание' }])
		}
		if (isOpen && searchQuery && !loadingData) {
			console.log(loadingData)
			setLoading(true)
			setLoadingStatus('')

			// Поиск данных запроса в группах Redux store по названию группы
			const groupData = groups[query.group]
			if (groupData) {
				if (query.subgroup) setSubgroupValue(query.subgroup) // Если при вводе была подгруппа, устанавливаем в значение Radio Group
				const formattedOptions = groupData.map(item => ({
					value: item,
					label: item === '0' ? 'Вся группа' : `Подгруппа ${item.toUpperCase()}`,
				}))
				setSubgroupOptions(formattedOptions)
				setLoading(false)
				setNotFound(false)
			} else if (query.professor) {
				const filteredProfessors = professors.filter(prof => prof.toLowerCase().includes(query.professor.toLowerCase()))
				const formattedOptions = filteredProfessors.map(item => ({
					value: item,
					label: item,
				}))
				setSubgroupOptions(formattedOptions)
				if (formattedOptions.length == 1) {
					setSubgroupValue(formattedOptions[0].value)
				}
				setLoading(false)
				setNotFound(false)
			} else {
				setLoading(false)
				setLoadingStatus(`Такого расписания к сожалению не нашлось`)
				setNotFound(true)
			}
			toast({
				title: 'Расписание успешно добавлено в календарь',
				description: <a href="/">следуйте инструкции</a>,
				status: 'success',
				duration: 6000,
				isClosable: true,
			})
		}
	}, [isOpen, loadingData])

	const handleDownloadButton = () => {
		if (!localStorage.getItem('modal_shown')) {
			setIsModalOpen(true)
			setFirstTimeUser(true)
			localStorage.setItem('modal_shown', 'true')
		} else {
			downloadScheduleFile()
		}
	}

	const handleAddToCalendar = async () => {
		let loadingTimer, loadingTimer2
		try {
			setLoading(true)

			if (!session?.provider_token) {
				throw new Error('Требуется перезайти в аккаунт')
			}

			const api = new SurguCalendarAPI(session.access_token)

			// Получаем расписание
			setLoadingStatus('Получаем расписание...')

			// Устанавливаем таймер для проверки долгой загрузки
			loadingTimer = setTimeout(() => {
				setLoadingStatus('Возможно включен VPN, из-за этого время загрузки увеличивается...')
			}, 5000)
			// Устанавливаем таймер для проверки долгой загрузки
			loadingTimer2 = setTimeout(() => {
				setLoadingStatus('Осталось еще чуть-чуть...')
			}, 10000)

			const { results, count } = await api.getScheduleV2(
				query.group || undefined,
				query.group ? subgroupValue : undefined,
				query.professor ? subgroupValue : undefined,
				isChecked,
			)

			// Если расписание получено, очищаем таймер
			clearTimeout(loadingTimer)
			clearTimeout(loadingTimer2)

			if (!results || count === 0) {
				throw new Error('Расписание не найдено')
			}

			// Создаем экземпляр API для Google Calendar
			setLoadingStatus('Создаем календарь...')
			const googleCalendarAPI = new GoogleCalendarAPI(session.provider_token, query.group ? subgroupValue : undefined)
			const calendarName = query.group
				? query.group + (subgroupValue !== '0' ? `${subgroupValue}` : '')
				: reductionFIO(subgroupValue)
			const calendar = await googleCalendarAPI.createCalendar(calendarName)

			// Добавляем занятия с прогрессом
			setLoadingStatus(`Добавляем занятия 0/${count}`)

			for (let i = 0; i < count; i++) {
				try {
					await googleCalendarAPI.createEvent(calendar.id, results[i])
					setLoadingStatus(`Добавляем занятия ${i + 1}/${count}`)
				} catch (error) {
					console.error(`Ошибка при добавлении занятия ${i + 1}:`, error)
				}
			}
			toast({
				title: 'Расписание успешно добавлено в календарь',
				description: <a href="/">следуйте инструкции</a>,
				status: 'success',
				duration: 6000,
				isClosable: true,
			})
		} catch (error) {
			clearTimeout(loadingTimer)
			clearTimeout(loadingTimer2)
			console.error('Ошибка добавления в календарь:', error)
			setLoadingStatus(`Возникла ошибка при добавлении расписания: ${error}`)
			setNotFound(true)
		} finally {
			setLoading(false)
		}
	}

	const downloadScheduleFile = async () => {
		let loadingTimer, loadingTimer2
		try {
			setIsModalOpen(false)
			setLoading(true) // Включаем индикатор загрузки
			const api = new SurguCalendarAPI()

			// Получаем расписание
			setLoadingStatus('Получаем расписание...')

			// Устанавливаем таймер для проверки долгой загрузки
			loadingTimer = setTimeout(() => {
				setLoadingStatus('Формируем файл...')
			}, 2000)
			// Устанавливаем таймер для проверки долгой загрузки
			loadingTimer2 = setTimeout(() => {
				setLoadingStatus('Осталось еще чуть-чуть...')
			}, 7000)

			const fileUrl = await api.getScheduleFile(
				query.group || undefined,
				query.group ? subgroupValue : undefined,
				query.professor ? subgroupValue : undefined,
				isChecked,
			) // Используем API для получения URL файла

			// Открытие файла
			window.open(fileUrl, '_blank')

			clearTimeout(loadingTimer)
			clearTimeout(loadingTimer2)

			setLoading(false) // Отключаем индикатор загрузки

			toast({
				title: 'Файл успешно скачен',
				description: 'следуйте инструкции',
				status: 'success',
				duration: 6000,
				isClosable: true,
			})
		} catch (error) {
			console.error('Ошибка скачивания файла:', error)
			setLoadingStatus(`Возникла ошибка при скачивании файла: ${error}`)
			setNotFound(true)
		} finally {
			setLoading(false)
			clearTimeout(loadingTimer)
			clearTimeout(loadingTimer2)
		}
	}

	return (
		<>
			<Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent className="container" minH="500px" borderRadius="30px 30px 0 0" p="24px">
					<header className="drawer-header">
						<span className="drawer-title">{query.group || reductionFIO(query.professor)}</span>
						<button onClick={onClose} className="close-btn">
							<img src={closeIcon} />
						</button>
					</header>

					<section className="drawer-body">
						{notFound && !loadingData ? (
							<div className="no-results">
								<img src={errorIcon} />
								<p>{loadingStatus}</p>
							</div>
						) : loading || loadingData ? (
							<div className="loading-indicator">
								<Spinner className="spinner" />
								<p>{loadingStatus}</p>
							</div>
						) : (
							<>
								<RadioGroup onChange={setSubgroupValue} value={subgroupValue}>
									<Stack gap={1} className="overflow-y-auto max-h-[350px] !mb-5">
										{subgroupOptions.map(subgroup => (
											<label key={subgroup.value} className={`custom-radio ${subgroupValue === subgroup.value ? 'active' : ''}`}>
												<input
													type="radio"
													name="group"
													value={subgroup.value}
													onChange={() => setSubgroupValue(subgroup.value)}
												/>
												<span className="radio-icon"></span>
												{subgroup.label}
											</label>
										))}
									</Stack>
								</RadioGroup>
								<div className="drawer-body__btn">
									<div className="checkbox-wrapper">
										<label className="custom-checkbox">
											<input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
											<span className="checkbox-icon"></span>
											Сокращать название дисциплин
											<span className="info-icon"></span>
										</label>
									</div>

									<div className="flex flex-col gap-2 lg:flex-row !mb-2">
										{session && (
											<button
												onClick={handleAddToCalendar}
												className="button-add button hover:!bg-green-700 transition-colors duration-300">
												Добавить в календарь
											</button>
										)}

										<button onClick={handleDownloadButton} className={`button-add button ${session ? 'lg:max-w-[350px]' : ''}`}>
											{!firstTimeUser && !session ? 'Добавить в календарь' : 'Скачать файл'}
										</button>
									</div>

									{!session && (
										<div className="flex justify-center text-center !px-1">
											<p className="cursor-default">
												<span
													className="!text-blue-900 font-bold cursor-pointer"
													onClick={() => {
														setLoading(true)
														setLoadingStatus('Пару секунд...')
														googleSignIn()
													}}>
													войти{' '}
												</span>
												и добавить расписание в календарь
											</p>
										</div>
									)}
								</div>
							</>
						)}
					</section>
				</DrawerContent>
			</Drawer>
			<MyModal
				isModalOpen={isModalOpen}
				handleCloseModal={() => setIsModalOpen(false)}
				handleSignin={googleSignIn}
				handleDownload={handleDownloadButton}
			/>
		</>
	)
}

// Модальное окно, предлагает пользователю войти, если он первый раз на сайте
const MyModal = ({ isModalOpen, handleCloseModal, handleSignin, handleDownload }) => {
	return (
		<Modal isOpen={isModalOpen} onClose={handleCloseModal} motionPreset="slideInBottom">
			<ModalOverlay />
			<ModalContent top="65%" m="40px" pt="10px">
				<ModalBody>
					<p>Войдите если хотите сразу добавить расписание в Google Calendar</p>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme="green" onClick={() => handleSignin()}>
						Войти
					</Button>
					<Button variant="outline" ml={3} onClick={() => handleDownload()}>
						Скачать файл
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default BottomSheet
