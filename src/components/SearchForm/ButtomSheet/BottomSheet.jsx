import {
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	Stack,
	Radio,
	RadioGroup,
	IconButton,
	Spinner,
	Toast,
	useToast,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
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
	const match = query.match(/^([0-9\-]+)([а-я])?$/i)

	return {
		group: match ? match[1] : query, // Основная часть (без буквы)
		subgroup: match && match[2] ? match[2] : null, // Последняя буква или null
	}
}

const BottomSheet = ({ isOpen, onClose, searchQuery }) => {
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
	const [loadingStatus, setLoadingStatus] = useState('') // Статус загрузки
	const [notFound, setNotFound] = useState(false) // Флаг "не найдено"
	const [loading, setLoading] = useState(false) // Флаг "идет загрузка"

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
			setSubgroupOptions([{ value: '0', label: 'Всё расписание' }])
		}
		if (isOpen && searchQuery) {
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
			} else {
				setLoading(false)
				setNotFound(true)
			}
		}
	}, [isOpen])

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
		try {
			setLoading(true)

			if (!session?.provider_token) {
				throw new Error('Требуется перезайти в аккаунт')
			}

			const api = new SurguCalendarAPI()

			// Получаем расписание
			setLoadingStatus('Получаем расписание...')

			// Устанавливаем таймер для проверки долгой загрузки
			const loadingTimer = setTimeout(() => {
				setLoadingStatus('Возможно включен VPN, из-за этого время загрузки увеличивается...')
			}, 5000)
			// Устанавливаем таймер для проверки долгой загрузки
			const loadingTimer2 = setTimeout(() => {
				setLoadingStatus('Осталось еще чуть-чуть...')
			}, 10000)

			const { results, count } = await api.getScheduleV2(query.group, subgroupValue || undefined, undefined)

			// Если расписание получено, очищаем таймер
			clearTimeout(loadingTimer, loadingTimer2)

			if (!results || count === 0) {
				throw new Error('Расписание не найдено')
			}

			// Создаем экземпляр API для Google Calendar
			setLoadingStatus('Создаем календарь...')
			const googleCalendarAPI = new GoogleCalendarAPI(session.provider_token)
			const calendarName = query.group + (subgroupValue ? `${subgroupValue}` : '')
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
				title: 'Успешно',
				description: 'Расписание добавлено в календарь',
				status: 'success',
				duration: 5000,
				isClosable: true,
			})
		} catch (error) {
			console.error('Ошибка добавления в календарь:', error)
			setLoadingStatus(`Возникла ошибка при добавлении расписания, ${error}`)
			setNotFound(true)
		} finally {
			setLoading(false)
		}
	}

	const downloadScheduleFile = async () => {
		try {
			setIsModalOpen(false)
			setLoading(true) // Включаем индикатор загрузки
			const api = new SurguCalendarAPI()

			const fileUrl = await api.getScheduleFile(query.group, query.subgroup) // Используем API для получения URL файла
			console.log(fileUrl)

			// Открытие файла
			window.open(fileUrl, '_blank')

			setLoading(false) // Отключаем индикатор загрузки

			toast({
				title: 'Успешно',
				description: 'Файл скачен, следуйте инструкции',
				status: 'success',
				duration: 5000,
				isClosable: true,
			})
		} catch (error) {
			setLoading(false) // Отключаем индикатор загрузки
			toast({
				title: 'Ошибка',
				description: error.message || 'Не удалось скачать файл. Попробуйте снова.',
				status: 'error',
				duration: 5000,
				isClosable: true,
			})
		}
	}

	return (
		<>
			<Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent className="container" minH="500px" borderRadius="30px 30px 0 0" p="24px">
					<header className="drawer-header">
						<span className="drawer-title">{query.group}</span>
						<button onClick={onClose} className="close-btn">
							<img src={closeIcon} />
						</button>
					</header>

					<section className="drawer-body">
						{notFound ? (
							<div className="no-results">
								<img src={errorIcon} />
								<p>{loadingStatus}</p>
							</div>
						) : loading ? (
							<div className="loading-indicator">
								<Spinner className="spinner" />
								<p>{loadingStatus}</p>
							</div>
						) : (
							<>
								<RadioGroup onChange={setSubgroupValue} value={subgroupValue}>
									<Stack gap={1}>
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
									{session && (
										<button onClick={handleAddToCalendar} className="button-add button">
											Добавить в календарь
										</button>
									)}

									<button onClick={handleDownloadButton} className="button-add button">
										{!firstTimeUser && !session ? 'Добавить в календарь' : 'Скачать файл'}
									</button>

									{!session && (
										<p>
											чтобы добавить в календарь нужно <span onClick={() => googleSignIn()}>войти</span>
										</p>
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
