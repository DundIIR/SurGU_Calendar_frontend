import './_fileSchedule.scss'
import plus from '../../img/plus.gif'
import {
	Button,
	Link,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Progress,
	Tooltip,
	useDisclosure,
	useToast,
} from '@chakra-ui/react'
import FileScheduleItem from '../FileScheduleItem/FileScheduleItem'
import { useSession } from '@supabase/auth-helpers-react'
import GoogleCalendarAPI from '../../services/GoogleCalendarAPI'
import { useEffect, useState } from 'react'
import SurguCalendarAPI from '../../services/SurguCalendarAPI'

const FileSchedule = ({ searches, setSearches }) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [title, setTitle] = useState('')

	useEffect(() => {
		const storedSearches = JSON.parse(localStorage.getItem('searches')) || []
		setSearches(storedSearches)
	}, [setSearches])

	return (
		<section className="page-main__files file-schedule">
			<h2 className="visually-hidden">Список файлов с расписанием</h2>
			<ul className="file-schedule__list">
				{searches.map((search, index) => (
					<FileScheduleItem key={index} title={search} setTitle={setTitle} onOpen={onOpen} />
				))}
			</ul>
			<VerticallyCenter isOpen={isOpen} onClose={onClose} title={title} setSearches={setSearches} />
		</section>
	)
}

function VerticallyCenter({ isOpen, onClose, title, setSearches }) {
	const session = useSession()

	const [progress, setProgress] = useState(0)
	const [error, setError] = useState({})
	const [body, setBody] = useState(
		session ? (
			`Также можно экспортировать файл с расписанием`
		) : (
			<p>
				Также можно сразу добавить расписание в Google Calendar. <br /> Для этого нужно войти в аккаунт.
			</p>
		),
	)
	const toast = useToast()

	const header = /^\d/.test(title[0]) ? (
		<>Расписание группы: {title}</>
	) : (
		<>
			Расписание преподавателя:
			<br />
			{title}
		</>
	)

	const handleAddToCalendar = () => {
		if (session && session.provider_token) {
			console.log('Запрос отправлен')
			const googleCalendarAPI = new GoogleCalendarAPI(session.provider_token)
			googleCalendarAPI.importSchedule(title, setProgress, setError)
			// setBody('Расписание добавлено')
			// console.log(title)
			// const temp = new SurguCalendarAPI()
			// console.log(temp.getSchedule(title))
		} else {
			toast({
				title: 'Упс... Проблема',
				description: 'Вам нужно перезайти в аккаунт',
				status: 'error',
				duration: 3500,
				isClosable: true,
			})
		}
	}

	useEffect(() => {
		if (Object.keys(error).length > 0) {
			toast({
				title: error.title,
				description: error.description,
				status: 'error',
				duration: 3500,
				isClosable: true,
			})

			setError('')
		}
	}, [error])

	const handleDelete = () => {
		setSearches(prevSearches => {
			const updatedSearches = prevSearches.filter(search => search !== title)
			localStorage.setItem('searches', JSON.stringify(updatedSearches))
			return updatedSearches
		})

		onClose()
	}

	return (
		<>
			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{header}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{progress ? (
							<Progress colorScheme="green" isAnimated borderRadius="5px" height="20px" hasStripe value={progress} />
						) : (
							body
						)}
					</ModalBody>
					<ModalFooter mt={4}>
						<Tooltip label="Начнет загрузку расписания в Календарь" placement="top">
							{body == 'Расписание добавле' ? (
								''
							) : (
								<Button mr="2" bg="green.300" _hover={{ bg: 'green.400' }} onClick={handleAddToCalendar}>
									{session ? 'Добавить в Google Calendar' : 'Экспортировать файл'}
								</Button>
							)}
						</Tooltip>
						<Tooltip label="Удалит плашку из списка" placement="top">
							<Button onClick={handleDelete} bg="red.300" _hover={{ bg: 'red.500' }}>
								Удалить
							</Button>
						</Tooltip>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}

export default FileSchedule
