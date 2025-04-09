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

	// Состояние для модалки
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [firstTimeUser, setFirstTimeUser] = useState(Boolean(localStorage.getItem('modal_shown')))

	const query = normalizeSearchQuery(searchQuery)
	const groups = useSelector(state => state.api.groups)
	const professors = useSelector(state => state.api.professors)

	useEffect(() => {
		if (!isOpen) {
			setSelectedValue('0')
			setIsChecked(true)
			setOptions([{ value: '0', label: 'Всё расписание' }])
			setNotFound(false)
		}
		if (isOpen && searchQuery) {
			setLoading(true)
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

	const downloadScheduleFile = async () => {
		try {
			setLoading(true) // Включаем индикатор загрузки
			const api = new SurguCalendarAPI()

			const fileUrl = await api.getScheduleFile(query.group, query.subgroup) // Используем API для получения URL файла
			console.log(fileUrl)

			// Открытие файла
			window.open(fileUrl, '_blank') // Или можно использовать другой способ для скачивания файла

			setLoading(false) // Отключаем индикатор загрузки
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
									<button onClick={handleDownloadButton} className="button-add button">
										{!firstTimeUser ? 'Добавить в календарь' : 'Скачать файл'}
									</button>
									<p>чтобы добавить в календарь нужно войти</p>
								</div>
							</>
						)}
					</section>
				</DrawerContent>
			</Drawer>
			<MyModal isModalOpen={isModalOpen} handleCloseModal={() => setIsModalOpen(false)} />
		</>
	)
}

const MyModal = ({ isModalOpen, handleCloseModal }) => {
	return (
		<Modal isOpen={isModalOpen} onClose={handleCloseModal} motionPreset="slideInBottom">
			<ModalOverlay />
			<ModalContent top="65%" m="40px" pt="10px">
				<ModalBody>
					<p>Войдите если хотите сразу добавить расписание в Google Calendar</p>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme="green" onClick={() => console.log('Вход через Google')}>
						Войти
					</Button>
					<Button variant="outline" ml={3}>
						Скачать файл
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default BottomSheet
