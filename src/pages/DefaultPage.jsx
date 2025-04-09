// import Header from '../components/Header/Header'
// import Footer from '../components/Footer/Footer'
// import FileSchedule from '../components/FileSchedule/FileSchedule'
// import Slogan from '../components/Slogan/Slogan'
// import Instruction from '../components/Instruction/Instruction'
import { useNavigate } from 'react-router-dom'
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react'
import Header from '../components/Header/Header'
import Slogan from '../components/Slogan/Slogan'

const DefaultPage = () => {
	// { updateSchedule, searches, setSearches }
	const session = useSession()
	const { isLoading } = useSessionContext()

	let navigate = useNavigate()

	const supabase = useSupabaseClient()
	const googleSignIn = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					scopes: 'https://www.googleapis.com/auth/calendar',
				},
			})
			if (error) throw error
		} catch (error) {
			alert(error)
		}
	}

	return (
		<>
			<div className="container">
				<Header></Header>
			</div>

			<main className="main container">
				<Slogan></Slogan>
			</main>
		</>
	)
}

export default DefaultPage
