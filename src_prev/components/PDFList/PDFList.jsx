import React, { useState, useEffect } from 'react'
import { Box, Input, VStack, Text, Flex, Button, useToast, Stack } from '@chakra-ui/react'
import axios from 'axios'
import { BiSearch } from 'react-icons/bi'
import SurguCalendarAPI from '../../services/SurguCalendarAPI'
import { useSession } from '@supabase/auth-helpers-react'

const fetchListFiles = async () => {
	return [
		{ id: '1', name: '609-11', url: 'https://hr.cetera.ru/vacancies/trainee/trainee/' },
		{ id: '2', name: '609-11а', url: 'https://hr.cetera.ru/vacancies/trainee/trainee/' },
		{ id: '3', name: '609-21', url: 'https://hr.cetera.ru/vacancies/trainee/trainee/' },
		{ id: '4', name: '609-31', url: 'https://hr.cetera.ru/vacancies/trainee/trainee/' },
		{ id: '5', name: '504-11', url: 'https://hr.cetera.ru/vacancies/trainee/trainee/' },
		{ id: '6', name: '504-11а', url: 'https://hr.cetera.ru/vacancies/trainee/trainee/' },
		{ id: '7', name: '605-12б', url: 'https://hr.cetera.ru/vacancies/trainee/trainee/' },
		{ id: '8', name: '606-31', url: 'https://hr.cetera.ru/vacancies/trainee/trainee/' },
		{ id: '9', name: '605-11а', url: 'Студент' },
		{ id: '410', name: 'emma.watson@example.com', url: 'Преподаватель' },
		{ id: '411', name: 'charlie.blue@example.com', url: 'Студент' },
		{ id: '412', name: 'olivia.purple@example.com', url: 'Администратор' },
		{ id: '413', name: 'daniel.red@example.com', url: 'Студент' },
		{ id: '414', name: 'amelia.yellow@example.com', url: 'Преподаватель' },
		{ id: '415', name: 'jacob.gray@example.com', url: 'Студент' },
		{ id: '416', name: 'isabella.orange@example.com', url: 'Староста' },
		{ id: '417', name: 'michael.pink@example.com', url: 'Преподаватель' },
		{ id: '510', name: 'emma.watson@example.com', url: 'Преподаватель' },
		{ id: '511', name: 'charlie.blue@example.com', url: 'Студент' },
		{ id: '512', name: 'olivia.purple@example.com', url: 'Администратор' },
		{ id: '513', name: 'daniel.red@example.com', url: 'Студент' },
		{ id: '514', name: 'amelia.yellow@example.com', url: 'Преподаватель' },
		{ id: '515', name: 'jacob.gray@example.com', url: 'Студент' },
		{ id: '516', name: 'isabella.orange@example.com', url: 'Староста' },
		{ id: '517', name: 'michael.pink@example.com', url: 'Преподаватель' },
		{ id: '610', name: 'emma.watson@example.com', url: 'Преподаватель' },
		{ id: '611', name: 'charlie.blue@example.com', url: 'Студент' },
		{ id: '612', name: 'olivia.purple@example.com', url: 'Администратор' },
		{ id: '613', name: 'daniel.red@example.com', url: 'Студент' },
		{ id: '614', name: 'amelia.yellow@example.com', url: 'Преподаватель' },
		{ id: '615', name: 'jacob.gray@example.com', url: 'Студент' },
		{ id: '616', name: 'isabella.orange@example.com', url: 'Староста' },
		{ id: '617', name: 'michael.pink@example.com', url: 'Преподаватель' },
		{ id: '1410', name: 'emma.watson@example.com', url: 'Преподаватель' },
		{ id: '1411', name: 'charlie.blue@example.com', url: 'Студент' },
		{ id: '1412', name: 'olivia.purple@example.com', url: 'Администратор' },
		{ id: '1413', name: 'daniel.red@example.com', url: 'Студент' },
		{ id: '1414', name: 'amelia.yellow@example.com', url: 'Преподаватель' },
		{ id: '1415', name: 'jacob.gray@example.com', url: 'Студент' },
		{ id: '1416', name: 'isabella.orange@example.com', url: 'Староста' },
		{ id: '1417', name: 'michael.pink@example.com', url: 'Преподаватель' },
		{ id: '1510', name: 'emma.watson@example.com', url: 'Преподаватель' },
		{ id: '1511', name: 'charlie.blue@example.com', url: 'Студент' },
		{ id: '1512', name: 'olivia.purple@example.com', url: 'Администратор' },
		{ id: '1513', name: 'daniel.red@example.com', url: 'Студент' },
		{ id: '1514', name: 'amelia.yellow@example.com', url: 'Преподаватель' },
		{ id: '1515', name: 'jacob.gray@example.com', url: 'Студент' },
		{ id: '1516', name: 'isabella.orange@example.com', url: 'Староста' },
		{ id: '1517', name: 'michael.pink@example.com', url: 'Преподаватель' },
		{ id: '1610', name: 'emma.watson@example.com', url: 'Преподаватель' },
		{ id: '1611', name: 'charlie.blue@example.com', url: 'Студент' },
		{ id: '1612', name: 'olivia.purple@example.com', url: 'Администратор' },
		{ id: '1613', name: 'daniel.red@example.com', url: 'Студент' },
		{ id: '1614', name: 'amelia.yellow@example.com', url: 'Преподаватель' },
		{ id: '1615', name: 'jacob.gray@example.com', url: 'Студент' },
		{ id: '1616', name: 'isabella.orange@example.com', url: 'Староста' },
		{ id: '1617', name: 'michael.pink@example.com', url: 'Преподаватель' },
	]
}

const PDFList = () => {
	const session = useSession()
	const toast = useToast()
	const [files, setFiles] = useState([]) // Все файлы
	const [filteredFiles, setFilteredFiles] = useState([]) // Файлы после поиска
	const [search, setSearch] = useState('') // Текущий поисковый запрос
	const [currentPage, setCurrentPage] = useState(1) // Текущая страница
	const itemsPerPage = 5 // Количество файлов на странице
	const surguCalendarAPI = new SurguCalendarAPI()

	// Получение файлов с сервера
	useEffect(() => {
		const fetchFiles = async () => {
			try {
				// const data = await fetchListFiles()
				const data = await surguCalendarAPI.getFilesList(session.access_token)

				setFiles(data)
				setFilteredFiles(data)
			} catch (error) {
				toast({
					title: 'Ошибка',
					description: 'Не удалось загрузить список файлов.',
					status: 'error',
					duration: 3000,
					isClosable: true,
				})
			}
		}

		fetchFiles()
	}, [])

	useEffect(() => {
		const filtered = files.filter(file => file.name && file.name.toLowerCase().includes(search.toLowerCase()))
		setFilteredFiles(filtered)
		setCurrentPage(1)
	}, [search, files])

	// Кол-во файлов на странице
	const endIndex = currentPage * itemsPerPage
	const startIndex = endIndex - itemsPerPage
	const currentFiles = filteredFiles.slice(startIndex, endIndex)
	console.log(startIndex, endIndex, currentFiles)

	// Переход на следующую страницу
	const nextPage = () => {
		if (currentPage * itemsPerPage < filteredFiles.length) {
			setCurrentPage(prevPage => prevPage + 1)
		}
	}

	// Переход на предыдущую страницу
	const prevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(prevPage => prevPage - 1)
		}
	}

	// Вычисление общего числа страниц
	const totalPages = Math.ceil(filteredFiles.length / itemsPerPage)

	// Формирование списка номеров страниц для пагинации с троеточием, если страниц больше 7
	const pageNumbers = []
	if (totalPages <= 7) {
		for (let i = 1; i <= totalPages; i++) {
			pageNumbers.push(i)
		}
	} else {
		// Пагинация с троеточием
		if (currentPage <= 4) {
			pageNumbers.push(1, 2, 3, 4, 5, '...', totalPages)
		} else if (currentPage >= totalPages - 3) {
			pageNumbers.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
		} else {
			pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
		}
	}

	const handlePageChange = page => {
		if (page === '...') return
		setCurrentPage(page)
	}

	return (
		<Box p={6} borderWidth={1} borderRadius="md" boxShadow="md" h="100%" width="500px">
			<VStack spacing={4} align="stretch">
				<Input placeholder="Поиск по названию файла..." value={search} onChange={e => setSearch(e.target.value)} />

				<Box maxH="400px">
					<Text fontWeight="bold" mb={2}>
						Список файлов:
					</Text>
					<VStack maxH="300px" spacing={2} align="stretch" overflowY="auto">
						{currentFiles.map(file => (
							<Flex
								key={file.id}
								justifyContent="space-between"
								alignItems="center"
								p={2}
								borderWidth={1}
								borderRadius="md"
								boxShadow="sm">
								<a href={file.url} target="_blank" rel="noopener noreferrer">
									<Text isTruncated width="400px">
										{file.name}
									</Text>
								</a>
							</Flex>
						))}
					</VStack>
				</Box>

				<Stack direction="row" spacing={3} align="center" w="100%" justify="center">
					<Button size="sm" onClick={prevPage} isDisabled={currentPage === 1}>
						Назад
					</Button>
					{pageNumbers.map((number, index) => (
						<Button
							key={index}
							size="sm"
							onClick={() => handlePageChange(number)}
							variant={number === currentPage ? 'solid' : 'outline'}
							colorScheme="blue"
							isDisabled={number === '...'}>
							{number}
						</Button>
					))}
					<Button size="sm" onClick={nextPage} isDisabled={currentPage * itemsPerPage >= filteredFiles.length}>
						Вперед
					</Button>
				</Stack>
			</VStack>
		</Box>
	)
}

export default PDFList
