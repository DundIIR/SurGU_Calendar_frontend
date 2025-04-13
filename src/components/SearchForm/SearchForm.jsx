import './_search-form.scss'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '@chakra-ui/react'
import { setGroups, setProfessors } from '../../store/reducer.js'
import { setQuery } from '../../store/searchSlice'
import BottomSheet from './ButtomSheet/BottomSheet'
import SurguCalendarAPI from '../../services/SurguCalendarAPI.js'

const SearchForm = () => {
	const [fieldSearch, setFieldSearch] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [showSuggestions, setShowSuggestions] = useState(false) // видимость подсказки
	const dispatch = useDispatch()
	const api = new SurguCalendarAPI()
	const toast = useToast()

	// useEffect для получения данных при монтировании компонента
	useEffect(() => {
		const fetchData = async () => {
			try {
				const groups = await api.getGroups()
				dispatch(setGroups(groups))

				const professors = await api.getProfessors()
				dispatch(setProfessors(professors))
			} catch (error) {
				toast({
					title: 'Ошибка при загрузке данных',
					description: error.message || 'Не удалось загрузить данные. Попробуйте обновить страницу.',
					status: 'error',
					duration: 5000,
					isClosable: true,
				})
			}
		}

		// Вызов функции получения данных
		fetchData()
	}, [])

	const handleInputChange = e => {
		let value = e.target.value
		let lastChar = value.slice(-1).toLowerCase()
		const isBackspace = e.nativeEvent.inputType === 'deleteContentBackward'
		let isWordBackspace = e.nativeEvent.inputType === 'deleteWordBackward'

		if (isWordBackspace) {
			value = ''
		} else if (/^\d/.test(value)) {
			if (value.length > 6 && /[а-я]/.test(lastChar)) {
				value = value.slice(0, 6) + lastChar
			} else if (fieldSearch.length == 4 && isBackspace) {
				value = value.slice(0, 2)
			} else if (value.length >= 3) {
				value = value.replace(/\D/g, '')
				value = value.slice(0, 3) + '-' + value.slice(3, 5)
			} else {
				value = value.replace(/\D/g, '')
			}
		} else {
			value = value.replace(/[^а-яА-ЯёЁ. ]/g, '').slice(0, 80)
		}

		setFieldSearch(value)
		setShowSuggestions(true)
	}

	// Данные из Redux
	const groups = useSelector(state => state.api.groups)
	const professors = useSelector(state => state.api.professors)

	// Фильтрация групп и преподавателей
	const filteredGroups = Object.keys(groups).filter(group => group.toLowerCase().includes(fieldSearch.toLowerCase()))
	const filteredProfessors = professors.filter(prof => prof.toLowerCase().includes(fieldSearch.toLowerCase()))

	const handleSelectItem = item => {
		console.log('клик')
		setFieldSearch(item) // Устанавливаем выбранное значение в input
		setSearchQuery(item) // Сохраняем в результат поиска
		setIsOpen(true) // Открываем BottomSheet
		// setShowSuggestions(false) // Скрываем подсказки
		setFieldSearch('')
	}

	// Компонент для отображения результатов поиска
	const SearchResults = ({ items }) => {
		console.log('список', items)

		return (
			<div className="search-results">
				{items.slice(0, 10).map((item, index) => (
					<button key={index} className="search-results__item" onMouseDown={() => handleSelectItem(item)}>
						{item}
					</button>
				))}
			</div>
		)
	}

	const handleSubmit = e => {
		e.preventDefault()
		if (fieldSearch.trim()) {
			handleSelectItem(fieldSearch) // Если ничего не выбрано, то использовать текущее значение
		}
	}

	return (
		<>
			<form className="search-form" onSubmit={handleSubmit}>
				<button type="submit" className="search-form__button"></button>
				<label className="label__input">
					<input
						type="text"
						value={fieldSearch}
						onChange={handleInputChange}
						required
						className="search-form__input"
						placeholder="xxx-хх..."
						onFocus={() => setShowSuggestions(true)} // Показываем подсказку при фокусе
						onBlur={() => setShowSuggestions(false)}
					/>
				</label>
				{showSuggestions && fieldSearch && (
					<div className="search-results-container">
						<SearchResults items={filteredGroups} />
						<SearchResults items={filteredProfessors} />
					</div>
				)}
			</form>

			<BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} searchQuery={searchQuery}></BottomSheet>
		</>
	)
}

export default SearchForm
