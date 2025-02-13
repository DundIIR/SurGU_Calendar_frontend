import { useSession } from '@supabase/auth-helpers-react'
import './_formRole.scss'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Stack, Input, Select, Button, List, ListItem, Text, Heading, VStack, useToast } from '@chakra-ui/react'
import SurguCalendarAPI from '../../services/SurguCalendarAPI'

const fetchUsers = async () => {
	return [
		{ id: '1', email: 'ruzim@uands.ru', role: 'Студент' },
		{ id: '2', email: 'rels@uands.ru', role: 'Администратор' },
		{ id: '3', email: 'johndoe@example.com', role: 'Студент' },
		{ id: '4', email: 'janedoe@example.com', role: 'Преподаватель' },
		{ id: '5', email: 'mike.brown@example.com', role: 'Администратор' },
		{ id: '6', email: 'sara.white@example.com', role: 'Студент' },
		{ id: '7', email: 'tom.hanks@example.com', role: 'Преподаватель' },
		{ id: '8', email: 'lisa.kim@example.com', role: 'Староста' },
		{ id: '9', email: 'alex.green@example.com', role: 'Студент' },
		{ id: '10', email: 'emma.watson@example.com', role: 'Преподаватель' },
		{ id: '11', email: 'charlie.blue@example.com', role: 'Студент' },
		{ id: '12', email: 'olivia.purple@example.com', role: 'Администратор' },
		{ id: '13', email: 'daniel.red@example.com', role: 'Студент' },
		{ id: '14', email: 'amelia.yellow@example.com', role: 'Преподаватель' },
		{ id: '15', email: 'jacob.gray@example.com', role: 'Студент' },
		{ id: '16', email: 'isabella.orange@example.com', role: 'Староста' },
		{ id: '17', email: 'michael.pink@example.com', role: 'Преподаватель' },
		{ id: '18', email: 'ava.brown@example.com', role: 'Администратор' },
		{ id: '19', email: 'william.black@example.com', role: 'Студент' },
		{ id: '20', email: 'sophia.gold@example.com', role: 'Преподаватель' },
		{ id: '21', email: 'james.silver@example.com', role: 'Староста' },
		{ id: '22', email: 'ella.turquoise@example.com', role: 'Администратор' },
		{ id: '23', email: 'henry.violet@example.com', role: 'Студент' },
		{ id: '24', email: 'mia.indigo@example.com', role: 'Преподаватель' },
		{ id: '25', email: 'lucas.lime@example.com', role: 'Староста' },
		{ id: '34', email: 'janedoe@example.com', role: 'Преподаватель' },
		{ id: '74', email: 'mike.brown@example.com', role: 'Администратор' },
		{ id: '36', email: 'sara.white@example.com', role: 'Студент' },
		{ id: '37', email: 'tom.hanks@example.com', role: 'Преподаватель' },
		{ id: '38', email: 'lisa.kim@example.com', role: 'Староста' },
		{ id: '39', email: 'alex.green@example.com', role: 'Студент' },
		{ id: '310', email: 'emma.watson@example.com', role: 'Преподаватель' },
		{ id: '311', email: 'charlie.blue@example.com', role: 'Студент' },
		{ id: '312', email: 'olivia.purple@example.com', role: 'Администратор' },
		{ id: '313', email: 'daniel.red@example.com', role: 'Студент' },
		{ id: '314', email: 'amelia.yellow@example.com', role: 'Преподаватель' },
		{ id: '315', email: 'jacob.gray@example.com', role: 'Студент' },
		{ id: '316', email: 'isabella.orange@example.com', role: 'Староста' },
		{ id: '317', email: 'michael.pink@example.com', role: 'Преподаватель' },
		{ id: '318', email: 'ava.brown@example.com', role: 'Администратор' },
		{ id: '319', email: 'william.black@example.com', role: 'Студент' },
		{ id: '320', email: 'sophia.gold@example.com', role: 'Преподаватель' },
		{ id: '321', email: 'james.silver@example.com', role: 'Староста' },
		{ id: '322', email: 'ella.turquoise@example.com', role: 'Администратор' },
		{ id: '323', email: 'henry.violet@example.com', role: 'Студент' },
		{ id: '324', email: 'mia.indigo@example.com', role: 'Преподаватель' },
		{ id: '325', email: 'lucas.lime@example.com', role: 'Староста' },
		{ id: '44', email: 'janedoe@example.com', role: 'Преподаватель' },
		{ id: '45', email: 'mike.brown@example.com', role: 'Администратор' },
		{ id: '46', email: 'sara.white@example.com', role: 'Студент' },
		{ id: '47', email: 'tom.hanks@example.com', role: 'Преподаватель' },
		{ id: '48', email: 'lisa.kim@example.com', role: 'Староста' },
		{ id: '49', email: 'alex.green@example.com', role: 'Студент' },
		{ id: '410', email: 'emma.watson@example.com', role: 'Преподаватель' },
		{ id: '411', email: 'charlie.blue@example.com', role: 'Студент' },
		{ id: '412', email: 'olivia.purple@example.com', role: 'Администратор' },
		{ id: '413', email: 'daniel.red@example.com', role: 'Студент' },
		{ id: '414', email: 'amelia.yellow@example.com', role: 'Преподаватель' },
		{ id: '415', email: 'jacob.gray@example.com', role: 'Студент' },
		{ id: '416', email: 'isabella.orange@example.com', role: 'Староста' },
		{ id: '417', email: 'michael.pink@example.com', role: 'Преподаватель' },
		{ id: '418', email: 'ava.brown@example.com', role: 'Администратор' },
		{ id: '419', email: 'william.black@example.com', role: 'Студент' },
		{ id: '420', email: 'sophia.gold@example.com', role: 'Преподаватель' },
		{ id: '421', email: 'james.silver@example.com', role: 'Староста' },
		{ id: '422', email: 'ella.turquoise@example.com', role: 'Администратор' },
		{ id: '423', email: 'henry.violet@example.com', role: 'Студент' },
		{ id: '424', email: 'mia.indigo@example.com', role: 'Преподаватель' },
		{ id: '425', email: 'lucas.lime@example.com', role: 'Староста' },
	]
}

const FormRole = () => {
	const session = useSession()

	const [users, setUsers] = useState([])
	const [filteredUsers, setFilteredUsers] = useState([])
	const [search, setSearch] = useState('')

	const [selectedRole, setSelectedRole] = useState('')

	const [currentPage, setCurrentPage] = useState(1)
	const [usersPerPage] = useState(5)

	const toast = useToast()

	const surguCalendarAPI = new SurguCalendarAPI()

	useEffect(() => {
		const loadUsers = async () => {
			// const data = await fetchUsers()
			const data = await surguCalendarAPI.getUsersList(session.access_token)
			setUsers(data)
			setFilteredUsers(data)
		}
		loadUsers()
	}, [])

	useEffect(() => {
		const filtered = users.filter(user => user.email.toLowerCase().includes(search.toLowerCase()))
		setFilteredUsers(filtered)
		setCurrentPage(1)
	}, [search, users])

	const handleSelectUser = user => {
		setSearch(user.email)
		setSelectedRole(user.role)
	}

	const handleSave = () => {
		const matchedUser = users.find(user => user.email === search)
		if (!matchedUser) {
			toast({
				title: 'Ошибка',
				description: 'Введена неверная почта. Пожалуйста, выберите пользователя из списка.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			})
			return
		}
		surguCalendarAPI.updateUserRole(session.access_token, search, selectedRole)
	}

	// Кол-во пользователей на странице
	const indexOfLastUser = currentPage * usersPerPage
	const indexOfFirstUser = indexOfLastUser - usersPerPage
	const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

	// Переход на следующую страницу
	const nextPage = () => {
		if (currentPage * usersPerPage < filteredUsers.length) {
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
	const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

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
		<Box w="900px" h="100%" ml="0" p={5} borderWidth="1px" borderRadius="lg" className="page-main__instruction">
			<VStack spacing={4} align="start">
				<Stack direction="row" spacing={4} align="center" w="100%">
					<Input placeholder="Введите почту для поиска" value={search} onChange={e => setSearch(e.target.value)} />
					<Select
						placeholder="Выберите роль"
						value={selectedRole}
						isDisabled={filteredUsers.length !== 1}
						onChange={e => setSelectedRole(e.target.value)}>
						<option value="Администратор">Администратор</option>
						<option value="Студент">Студент</option>
						<option value="Преподаватель">Преподаватель</option>
						<option value="Староста">Староста</option>
					</Select>
				</Stack>
				<Box border="1px solid" borderColor="gray.200" borderRadius="md" h="auto" w="100%" pr="10px">
					<List h="100%" pr="10px">
						{currentUsers.map(user => (
							<ListItem
								key={user.id}
								p={2}
								cursor="pointer"
								_hover={{ backgroundColor: 'gray.100' }}
								onClick={() => handleSelectUser(user)}>
								<Text>{user.email}</Text>
							</ListItem>
						))}
					</List>
				</Box>
				<Stack direction="row" spacing={4} align="center" w="100%" justify="center">
					<Button onClick={prevPage} isDisabled={currentPage === 1}>
						Назад
					</Button>
					{pageNumbers.map((number, index) => (
						<Button
							key={index}
							onClick={() => handlePageChange(number)}
							variant={number === currentPage ? 'solid' : 'outline'}
							colorScheme="blue"
							isDisabled={number === '...'}>
							{number}
						</Button>
					))}
					<Button onClick={nextPage} isDisabled={currentPage * usersPerPage >= filteredUsers.length}>
						Вперед
					</Button>
				</Stack>
				<Button colorScheme="blue" isDisabled={!search || !selectedRole} onClick={handleSave}>
					Сохранить
				</Button>
			</VStack>
		</Box>
	)
}

export default FormRole
