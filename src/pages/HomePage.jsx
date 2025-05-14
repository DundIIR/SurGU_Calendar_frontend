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
import LoadPage from './LoadPage'

const HomePage = () => {
	// { updateSchedule, searches, setSearches }
	const session = useSession()
	const { isLoading } = useSessionContext()
	const [loading, setLoading] = useState(false)

	let navigate = useNavigate()

	const supabase = useSupabaseClient()

	const signOut = async () => {
		await supabase.auth.signOut()
		setLoading(false)
	}

	useEffect(() => {
		if (!session || !session?.provider_token) {
			setLoading(true)

			signOut()
		}
	}, [session])

	if (isLoading || loading) {
		return <LoadPage />
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
