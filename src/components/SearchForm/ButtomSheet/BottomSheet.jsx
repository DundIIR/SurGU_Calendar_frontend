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
import errorIcon from '../../../img/okey.svg'
import './_bottom-sheet.scss'
import { useSelector } from 'react-redux'
import SurguCalendarAPI from '../../../services/SurguCalendarAPI'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import GoogleCalendarAPI from '../../../services/GoogleCalendarAPI'

const normalizeSearchQuery = query => {
	const match = query.match(/^([0-9\-]+)([а-я])?$/i)

	return {
		group: match ? match[1] : query, // Основная часть (без буквы)
		subgroup: match && match[2] ? match[2] : null, // Последняя буква или null
	}
}

const BottomSheet = ({ isOpen, onClose, searchQuery }) => {
	const [selectedValue, setSelectedValue] = useState('')
	const [isChecked, setIsChecked] = useState(true)
	const [options, setOptions] = useState([{ value: 'fullGroup', label: 'Вся группа' }])

	const [notFound, setNotFound] = useState(false)
	const [loading, setLoading] = useState(false)
	const toast = useToast()
	const session = useSession()

	// Состояние для модалки
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [firstTimeUser, setFirstTimeUser] = useState(Boolean(localStorage.getItem('modal_shown')))

	// Состояния загрузки расписания
	const [loadingStatus, setLoadingStatus] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const query = normalizeSearchQuery(searchQuery)
	const groups = useSelector(state => state.api.groups)
	const professors = useSelector(state => state.api.professors)

	const supabase = useSupabaseClient()

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

	useEffect(() => {
		if (!isOpen) {
			setSelectedValue('0')
			setIsChecked(true)
			setOptions([{ value: '0', label: 'Всё расписание' }])
			setNotFound(false)
		}
		if (isOpen && searchQuery) {
			setLoading(true)
			setIsLoading(false)
			setLoadingStatus('')
			const groupData = groups[query.group]
			if (groupData) {
				if (query.subgroup) setSelectedValue(query.subgroup)
				const formattedOptions = groupData.map(item => ({
					value: item,
					label: item === '0' ? 'Вся группа' : `Подгруппа ${item.toUpperCase()}`,
				}))
				setOptions(formattedOptions)
				setLoading(false)
				setNotFound(false)
			} else {
				setLoading(false)
				setNotFound(true)
			}
			// if (query.subgroup) setSelectedValue(query.subgroup)
			// api
			// 	.getSearchCheck(query.group)
			// 	.then(data => {
			// 		if (data && data.length > 0) {
			// 			const formattedOptions = data.map((item, index) => {
			// 				if (item === '0') {
			// 					return { value: '0', label: 'Всё группа' }
			// 				} else {
			// 					return {
			// 						value: item,
			// 						label: `Подгруппа ${item.toUpperCase()}`, // Преобразуем в "Подгруппа A", "Подгруппа Б" и т.д.
			// 					}
			// 				}
			// 			})

			// 			setOptions(formattedOptions)
			// 			setLoading(false)
			// 			setNotFound(false)
			// 		} else {
			// 			setNotFound(true)
			// 		}
			// 	})
			// 	.catch(error => {
			// 		setLoading(false)
			// 		setNotFound(true)
			// 		toast({
			// 			title: 'Ошибка',
			// 			description: error.message || 'Не удалось загрузить данные. Попробуйте обновить страницу.',
			// 			status: 'error',
			// 			duration: 5000,
			// 			isClosable: true,
			// 		})
			// 	})
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
			setIsLoading(true)

			if (!session?.provider_token) {
				throw new Error('Требуется перезайти в аккаунт')
			}

			const api = new SurguCalendarAPI()

			// Получаем расписание
			setLoadingStatus('Получаем расписание...')
			const { results, count } = await api.getScheduleV2(query.group, query.subgroup || undefined, undefined)

			if (!results || count === 0) {
				throw new Error('Расписание не найдено')
			}

			// Создаем экземпляр API для Google Calendar
			setLoadingStatus('Создаем календарь...')
			const googleCalendarAPI = new GoogleCalendarAPI(session.provider_token)
			const calendarName = query.group + (query.subgroup ? `${query.subgroup}` : '')
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
			// toast({
			// 	title: 'Успешно',
			// 	description: 'Расписание добавлено в календарь',
			// 	status: 'success',
			// 	duration: 5000,
			// 	isClosable: true,
			// })
		} catch (error) {
			console.error('Ошибка добавления в календарь:', error)
			setIsLoading(false)
			toast({
				title: 'Ошибка',
				description: error.message || 'Не удалось добавить расписание',
				status: 'error',
				duration: 5000,
				isClosable: true,
			})
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
						{loading ? (
							<div className="loading-indicator">
								<Spinner className="spinner" />
							</div>
						) : notFound ? (
							<div className="no-results">
								<img src={errorIcon} />
								<p>
									Такого расписания не нашлось
									<br />
									обратитесь в поддержку
								</p>
							</div>
						) : isLoading ? (
							<div className="loading-indicator">
								<Spinner className="spinner" />
								<p>{loadingStatus}</p>
							</div>
						) : (
							<>
								<RadioGroup onChange={setSelectedValue} value={selectedValue}>
									<Stack gap={1}>
										{options.map(option => (
											<label key={option.value} className={`custom-radio ${selectedValue === option.value ? 'active' : ''}`}>
												<input type="radio" name="group" value={option.value} onChange={() => setSelectedValue(option.value)} />
												<span className="radio-icon"></span>
												{option.label}
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

// function VerticallyCenter({ isOpen, onClose, title, setSearches }) {
// 	const session = useSession()

// 	const [progress, setProgress] = useState(0)
// 	const [error, setError] = useState({})
// 	const [body, setBody] = useState(
// 		session ? (
// 			`Также можно экспортировать файл с расписанием`
// 		) : (
// 			<p>
// 				Также можно сразу добавить расписание в Google Calendar. <br /> Для этого нужно войти в аккаунт.
// 			</p>
// 		),
// 	)
// 	const toast = useToast()

// 	const header = /^\d/.test(title[0]) ? (
// 		<>Расписание группы: {title}</>
// 	) : (
// 		<>
// 			Расписание преподавателя:
// 			<br />
// 			{title}
// 		</>
// 	)

// 	const handleAddToCalendar = () => {
// 		if (session && session.provider_token) {
// 			console.log('Запрос отправлен')
// 			const googleCalendarAPI = new GoogleCalendarAPI(session.provider_token)
// 			googleCalendarAPI.importSchedule(title, setProgress, setError)
// 			// setBody('Расписание добавлено')
// 			// console.log(title)
// 			// const temp = new SurguCalendarAPI()
// 			// console.log(temp.getSchedule(title))
// 		} else {
// 			toast({
// 				title: 'Упс... Проблема',
// 				description: 'Вам нужно перезайти в аккаунт',
// 				status: 'error',
// 				duration: 3500,
// 				isClosable: true,
// 			})
// 		}
// 	}

// 	useEffect(() => {
// 		if (Object.keys(error).length > 0) {
// 			toast({
// 				title: error.title,
// 				description: error.description,
// 				status: 'error',
// 				duration: 3500,
// 				isClosable: true,
// 			})

// 			setError('')
// 		}
// 	}, [error])

// 	const handleDelete = () => {
// 		setSearches(prevSearches => {
// 			const updatedSearches = prevSearches.filter(search => search !== title)
// 			localStorage.setItem('searches', JSON.stringify(updatedSearches))
// 			return updatedSearches
// 		})

// 		onClose()
// 	}

// 	return (
// 		<>
// 			<Modal onClose={onClose} isOpen={isOpen} isCentered>
// 				<ModalOverlay />
// 				<ModalContent>
// 					<ModalHeader>{header}</ModalHeader>
// 					<ModalCloseButton />
// 					<ModalBody>
// 						{progress ? (
// 							<Progress colorScheme="green" isAnimated borderRadius="5px" height="20px" hasStripe value={progress} />
// 						) : (
// 							body
// 						)}
// 					</ModalBody>
// 					<ModalFooter mt={4}>
// 						<Tooltip label="Начнет загрузку расписания в Календарь" placement="top">
// 							{body == 'Расписание добавле' ? (
// 								''
// 							) : (
// 								<Button mr="2" bg="green.300" _hover={{ bg: 'green.400' }} onClick={handleAddToCalendar}>
// 									{session ? 'Добавить в Google Calendar' : 'Экспортировать файл'}
// 								</Button>
// 							)}
// 						</Tooltip>
// 						<Tooltip label="Удалит плашку из списка" placement="top">
// 							<Button onClick={handleDelete} bg="red.300" _hover={{ bg: 'red.500' }}>
// 								Удалить
// 							</Button>
// 						</Tooltip>
// 					</ModalFooter>
// 				</ModalContent>
// 			</Modal>
// 		</>
// 	)
// }
