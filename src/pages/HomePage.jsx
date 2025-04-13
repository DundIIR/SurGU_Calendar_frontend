// import Header from '../components/Header/Header'
// import Footer from '../components/Footer/Footer'
// import FileSchedule from '../components/FileSchedule/FileSchedule'
// import Slogan from '../components/Slogan/Slogan'
// import Instruction from '../components/Instruction/Instruction'
import { useNavigate } from 'react-router-dom'
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react'
import Header from '../components/Header/Header'
import Slogan from '../components/Slogan/Slogan'
import { Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

const HomePage = () => {
	// { updateSchedule, searches, setSearches }
	const session = useSession()
	const { isLoading } = useSessionContext()

	let navigate = useNavigate()

	const supabase = useSupabaseClient()

	const signOut = async e => {
		e.preventDefault()
		await supabase.auth.signOut()
		// setLoading(false)
	}

	if (isLoading) {
		return (
			<>
				<Spinner />
			</>
		)
	}

	return (
		<>
			<div className="container">
				<Header googleBtn={signOut}></Header>
			</div>

			<main className="main container">
				<Slogan></Slogan>
			</main>
		</>
	)
}

export default HomePage
