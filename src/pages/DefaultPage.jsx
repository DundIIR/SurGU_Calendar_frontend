import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Spinner, useToast } from '@chakra-ui/react'
import Header from '../components/Header/Header'
import Slogan from '../components/Slogan/Slogan'
import LoadPage from './LoadPage'
import Footer from '../components/Footer/Footer'
import Title from '../components/Title/Title'
import BottomSheet from '../components/SearchForm/ButtomSheet/BottomSheet'
import SearchForm from '../components/SearchForm/SearchForm'
import CardsList from '../components/Cards/CardsList'

const DefaultPage = () => {
	const session = useSession()
	const navigate = useNavigate()
	const location = useLocation()
	const supabase = useSupabaseClient()
	const toast = useToast()

	// 1. Функция входа через Google
	const googleSignIn = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					scopes: 'https://www.googleapis.com/auth/calendar',
					redirectTo: window.location.origin,
				},
			})
			if (error) throw error
		} catch (error) {
			toast({
				title: 'Ошибка входа',
				description: error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
			})
		}
	}

	const signOut = async () => {
		await supabase.auth.signOut()
		// setLoading(false)
	}

	// 2. Проверка и обновление сессии
	useEffect(() => {
		// Проверяем сессию при загрузке
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession()
			if (session) {
				navigate('/home') // Перенаправляем если уже авторизован
			}
		}

		checkSession()

		// Подписываемся на изменения аутентификации
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_IN') {
				navigate('/home')
			}
			if (event === 'TOKEN_REFRESHED') {
				console.log('Токен обновлён')
			}
			if (event === 'SIGNED_OUT') {
				console.log('Вы вышли из системы')
			}
		})

		return () => subscription.unsubscribe()
	}, [navigate, supabase])

	// 3. Если сессия есть, перенаправляем
	if (session) {
		navigate('/home')
		return <LoadPage />
	} else {
		signOut()
	}

	return (
		<div className="container h-full">
			<Header googleBtn={googleSignIn} />
			<main className="main container">
				<Slogan admin={false} />
				<Title
					title={
						<p>
							Подходит для <span className="highlight--blue">любого </span>
							<br />
							умного календаря
						</p>
					}
					position="right">
					<CardsList />
				</Title>
			</main>
			<Footer />
		</div>
	)
}

export default DefaultPage
