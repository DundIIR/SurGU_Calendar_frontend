import { useSession } from '@supabase/auth-helpers-react'
import './_formSearch.scss'
import { useState } from 'react'
import axios from 'axios'

const FormSearch = ({ updateSchedule }) => {
	const [fieldSearch, setFieldSearch] = useState('')

	const handleInputChange = e => {
		let value = e.target.value
		let lastChar = value.slice(-1).toLowerCase()
		if (/^\d/.test(value)) {
			if (value.length > 6 && /[а-я]/.test(lastChar)) {
				value = value.slice(0, 6) + lastChar
				console.log(value)
			} else if (value.length > 3) {
				value = value.replace(/\D/g, '')
				value = value.slice(0, 3) + '-' + value.slice(3, 5)
			} else {
				value = value.replace(/\D/g, '')
			}
		} else {
			value = value.replace(/[^а-яА-ЯёЁ. ]/g, '').slice(0, 80)
		}

		setFieldSearch(value)
	}

	const handleSubmit = async e => {
		e.preventDefault()

		let newSearch = fieldSearch.trim()
		if (newSearch) {
			const existingSearches =
				JSON.parse(localStorage.getItem('searches')) || []
			existingSearches.push(newSearch)
			localStorage.setItem('searches', JSON.stringify(existingSearches))
			setFieldSearch('')
			updateSchedule()
		}
		// if (session) {
		// 	const calendar = {
		// 		summary: fieldSearch,
		// 	}
		// 	await axios
		// 		.post('https://www.googleapis.com/calendar/v3/calendars', JSON.stringify(calendar), {
		// 			headers: {
		// 				Authorization: 'Bearer ' + session.provider_token,
		// 				'Content-Type': 'application/json',
		// 			},
		// 		})
		// 		.then(response => {
		// 			setFieldSearch('')
		// 			console.log(response.data)
		// 		})
		// 		.catch(error => {
		// 			console.error('There was an error!', error)
		// 		})
		// } else {
		// 	alert('Необходимо войти в аккаунт')
		// }
	}

	return (
		<form className='form-search' onSubmit={e => handleSubmit(e)}>
			<button className='form-search__btn' type='submit'>
				<svg
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M13.7365 13.7687L20 20M15.4557 9.69841C15.4557 12.8456 12.8913 15.3968 9.72785 15.3968C6.56444 15.3968 4 12.8456 4 9.69841C4 6.55126 6.56444 4 9.72785 4C12.8913 4 15.4557 6.55126 15.4557 9.69841Z'
						stroke='#484848'
						strokeWidth='2'
						strokeLinecap='round'
					/>
				</svg>

				<span className='visually-hidden'>Найти</span>
			</button>
			<input
				className='form-search__field'
				type='text'
				name='text'
				placeholder='введите свою группу(подгруппу) или фамилию преподавателя'
				value={fieldSearch}
				onChange={e => handleInputChange(e)}
				required
			/>
		</form>
	)
}

export default FormSearch
