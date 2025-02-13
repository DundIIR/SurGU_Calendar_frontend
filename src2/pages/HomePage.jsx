import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import FileSchedule from '../components/FileSchedule/FileSchedule'
import Slogan from '../components/Slogan/Slogan'
import Instruction from '../components/Instruction/Instruction'
import { useNavigate } from 'react-router-dom'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Container, Heading } from '@chakra-ui/react'

const HomePage = ({ updateSchedule, searches, setSearches }) => {
	const session = useSession()
	const supabase = useSupabaseClient()

	const user = session.user.user_metadata.name

	let navigate = useNavigate()

	const signOut = async e => {
		e.preventDefault()
		await supabase.auth.signOut()
		navigate('/')
	}

	return (
		<div className="page">
			<Header googleBtn={signOut} updateSchedule={updateSchedule} />
			<Container maxW="1820px" my={-6}>
				<Heading fontSize="38px" color={'#484848'} fontWeight={500}>
					Привет, {user}
				</Heading>
			</Container>
			<main className="page-main">
				<h1 className="visually-hidden">SurGU Календарь - новое расписание СурГУ</h1>
				<Instruction />
				<Slogan />
				<FileSchedule searches={searches} setSearches={setSearches} />
			</main>
			<Footer />
		</div>
	)
}

export default HomePage
